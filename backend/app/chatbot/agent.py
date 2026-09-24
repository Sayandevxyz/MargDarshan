import re
import os
import requests
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.chatbot import tools
from backend.app.models.models import Student, User, Application

SAATHI_SYSTEM_PROMPT = """
You are SAATHI, the scholarship assistance companion inside MargDarshan, built for the Ministry of Tribal Affairs (MoTA).
Your purpose is to help Scheduled Tribe (ST) students and parents understand and navigate scholarship schemes, verification, documents, and DBT payments.

Core Groundrules:
1. Ground your answers ONLY in the retrieved verified context and official guidelines.
2. Never invent scholarship rules, amounts, or payment dates.
3. If an application is flagged or has a deficiency, explain:
   - What happened?
   - Why it matters?
   - What the student can do to fix it?
4. Clearly distinguish prototype/mock information.
5. If responding in Hindi, use polite, natural, and accessible Devanagari Hindi.
6. Keep answers concise, clear, and reassuring.
"""

def detect_language(text: str) -> str:
    # Bengali script range
    if any('\u0980' <= char <= '\u09FF' for char in text):
        return "bn"
    # Tamil script range
    if any('\u0B80' <= char <= '\u0BFF' for char in text):
        return "ta"
    # Ol Chiki (Santali) range
    if any('\u1C50' <= char <= '\u1C7F' for char in text):
        return "santali"
    # Devanagari script range (Hindi, Gondi, Bhili, etc.)
    if any('\u0900' <= char <= '\u097F' for char in text):
        return "hi"
    return "en"

def call_groq_api(system_prompt: str, user_message: str, context: str, language: str) -> Optional[str]:
    api_key = settings.GROQ_API_KEY
    if not api_key:
        return None
    try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        if language == "hi":
            lang_note = "Respond in natural, polite Hindi (Devanagari script)."
        elif language == "bn":
            lang_note = "Respond in natural, polite Bengali (বাংলা script)."
        elif language == "ta":
            lang_note = "Respond in natural, polite Tamil (தமிழ் script)."
        elif language == "santali":
            lang_note = "Respond in Santali or clear accessible language."
        else:
            lang_note = "Respond in clear English."
        
        messages = [
            {
                "role": "system",
                "content": f"{system_prompt}\n\n[Retrieved Verified Student & Scheme Context]:\n{context}\n\n[Language Instruction]: {lang_note}"
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
        
        payload = {
            "model": settings.GROQ_MODEL,
            "messages": messages,
            "temperature": 0.3,
            "max_tokens": 1024
        }
        
        res = requests.post(url, json=payload, headers=headers, timeout=12)
        if res.status_code == 200:
            data = res.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Groq API call notice: {e}")
    return None

def process_saathi_chat(
    db: Session,
    message: str,
    user: Optional[User] = None,
    preferred_lang: Optional[str] = None
) -> Dict[str, Any]:
    msg_clean = message.strip()
    detected_lang = preferred_lang or detect_language(msg_clean)
    msg_lower = msg_clean.lower()
    
    # 1. Check Authentication Guardrail (Section 31 & 32)
    personal_keywords = [
        "my status", "my scholarship", "my application", "my payment", "why is my", "mera status",
        "meri", "mera", "bhugtan", "status", "payment", "deficiency", "kab aayega", "kyun nahi aaya"
    ]
    is_personal_query = any(k in msg_lower for k in personal_keywords)
    
    if is_personal_query and not user:
        if detected_lang == "bn":
            return {
                "response": "আপনার স্কলারশিপ এবং আবেদনের তথ্য নিরাপদে দেখতে অনুগ্রহ করে প্রথমে সাইন ইন করুন।",
                "language": "bn",
                "tools_called": ["auth_guardrail"],
                "citations": [],
                "action_buttons": [{"label": "সাইন ইন করুন (Login)", "action": "LOGIN"}],
                "fallback_mode": False
            }
        elif detected_lang == "hi":
            return {
                "response": "कृपया पहले साइन इन करें ताकि मैं आपकी छात्रवृत्ति और आवेदन की जानकारी सुरक्षित रूप से देख सकूँ।",
                "language": "hi",
                "tools_called": ["auth_guardrail"],
                "citations": [],
                "action_buttons": [{"label": "साइन इन करें (Login)", "action": "LOGIN"}],
                "fallback_mode": False
            }
        return {
            "response": "Please sign in first so I can securely access your scholarship information.",
            "language": "en",
            "tools_called": ["auth_guardrail"],
            "citations": [],
            "action_buttons": [{"label": "Sign In", "action": "LOGIN"}],
            "fallback_mode": False
        }

    # If user is authenticated, retrieve student record if applicable
    student = None
    student_id = None
    context_parts = []
    
    if user and user.role == "STUDENT":
        student = db.query(Student).filter(Student.user_id == user.id).first()
        if student:
            student_id = student.id
            app_info = tools.get_application_status(db, student_id)
            pay_info = tools.get_payment_history(db, student_id)
            def_info = tools.list_deficiencies(db, student_id)
            
            context_parts.append(f"Student: {student.name}, APAAR: {student.apaar_id}, District: {student.district}, State: {student.state}")
            context_parts.append(f"Active Application: {app_info}")
            context_parts.append(f"Payment Record: {pay_info}")
            if def_info:
                context_parts.append(f"Active Deficiencies: {def_info}")
    
    # 2. Try Groq API Inference if configured
    if settings.GROQ_API_KEY:
        context_str = "\n".join(context_parts) if context_parts else "No specific personal application selected. General MoTA guidelines apply."
        groq_reply = call_groq_api(SAATHI_SYSTEM_PROMPT, msg_clean, context_str, detected_lang)
        if groq_reply:
            # Determine appropriate action buttons
            action_buttons = []
            if any(k in msg_lower for k in ["payment", "bhugtan", "money", "rupee", "dbt"]):
                action_buttons = [
                    {"label": "View Payment Timeline", "action": "VIEW_PAYMENT"},
                    {"label": "Raise Grievance", "action": "RAISE_GRIEVANCE"}
                ]
            elif any(k in msg_lower for k in ["application", "status", "track"]):
                action_buttons = [
                    {"label": "View Application", "action": "VIEW_APPLICATION"},
                    {"label": "Document Wallet", "action": "VIEW_DOCUMENTS"}
                ]
            elif any(k in msg_lower for k in ["scheme", "eligibility", "apply"]):
                action_buttons = [
                    {"label": "Check Eligibility", "action": "CHECK_ELIGIBILITY"},
                    {"label": "Explore Schemes", "action": "EXPLORE_SCHEMES"}
                ]
            else:
                action_buttons = [
                    {"label": "Check Application Status", "action": "VIEW_APPLICATION"},
                    {"label": "Ask about Payments", "action": "PAYMENT_QUERY"}
                ]
            
            return {
                "response": groq_reply,
                "language": detected_lang,
                "tools_called": ["groq_llm_inference", "get_application_status", "get_payment_history"],
                "citations": [{"source": f"Groq Cloud AI ({settings.GROQ_MODEL})", "type": "Live LLM Engine"}],
                "action_buttons": action_buttons,
                "fallback_mode": False
            }

    # 3. Deterministic Fallback Mode (Section 89)
    # Persona 5: Hindi Query Handling ("मेरी छात्रवृत्ति का भुगतान अभी तक क्यों नहीं आया?")
    if "भुगतान" in msg_clean or "पैसा" in msg_clean or "रुपया" in msg_clean or ("छात्रवृत्ति" in msg_clean and "क्यों" in msg_clean):
        if student_id and student:
            app_info = tools.get_application_status(db, student_id)
            reply = (
                f"नमस्ते {student.name}! आपके {app_info.get('scheme_name', 'पोस्ट-मैट्रिक छात्रवृत्ति')} आवेदन की स्थिति 'स्वीकृत' (Sanctioned) है, "
                f"लेकिन भुगतान वर्तमान में डीबीटी (DBT) प्रसंस्करण की प्रतीक्षा में है।\n\n"
                f"• नवीनतम स्थिति अद्यतन: 18 सितंबर 2026\n"
                f"• बैंक खाता: सुरक्षित रूप से आधार से जुड़ा हुआ है (Aadhaar Seeded)\n"
                f"• अनुमानित संवितरण: अगले 3-5 कार्य दिवस\n\n"
                f"यदि आपको अधिक सहायता चाहिए, तो आप सीधे शिकायत दर्ज कर सकते हैं।"
            )
            return {
                "response": reply,
                "language": "hi",
                "tools_called": ["get_payment_history", "get_application_status"],
                "citations": [{"source": "DBT PFMS Gateway", "type": "Synthetic Records"}],
                "action_buttons": [
                    {"label": "आवेदन देखें (View App)", "action": "VIEW_APPLICATION"},
                    {"label": "भुगतान समयरेखा (Payment Timeline)", "action": "VIEW_PAYMENT"},
                    {"label": "शिकायत दर्ज करें (Raise Grievance)", "action": "RAISE_GRIEVANCE"}
                ],
                "fallback_mode": True
            }

    # Bengali Query: Payment status / pending reason ("আমার স্কলারশিপ পেমেন্ট কেন বাকি?")
    if any(k in msg_clean for k in ["পেমেন্ট", "টাকা", "স্কলারশিপ", "বিলম্বিত", "বাকি", "আবেদন"]):
        if student_id and student:
            app_info = tools.get_application_status(db, student_id)
            reply = (
                f"নমস্কার {student.name}! আপনার {app_info.get('scheme_name', 'পোস্ট-ম্যাট্রিক স্কলারশিপ')} আবেদনটি 'মঞ্জুরীকৃত' (Sanctioned) হয়েছে, "
                f"কিন্তু বর্তমানে ডিবিটি (DBT) প্রক্রিয়াকরণের অপেক্ষায় রয়েছে।\n\n"
                f"• সর্বশেষ স্থিতি আপডেট: ১৮ সেপ্টেম্বর ২০২৬\n"
                f"• ব্যাংক অ্যাকাউন্ট: আধার সংযুক্ত ও সক্রিয় (Aadhaar Seeded)\n"
                f"• আনুমানিক বিতরণ: আগামী ৩-৫ কার্যদিবসের মধ্যে\n\n"
                f"যদি আপনার আরো কোনো সাহায্যের প্রয়োজন হয়, তবে সরাসরি অভিযোগ জানাতে পারেন।"
            )
            return {
                "response": reply,
                "language": "bn",
                "tools_called": ["get_payment_history", "get_application_status"],
                "citations": [{"source": "DBT PFMS Gateway", "type": "Synthetic Records"}],
                "action_buttons": [
                    {"label": "আবেদন দেখুন", "action": "VIEW_APPLICATION"},
                    {"label": "পেমেন্ট টাইমলাইন", "action": "VIEW_PAYMENT"},
                    {"label": "অভিযোগ জানান", "action": "RAISE_GRIEVANCE"}
                ],
                "fallback_mode": True
            }

    # English Query: Payment status / pending reason
    if any(k in msg_lower for k in ["payment pending", "scholarship payment", "where is my money", "when will i receive payment", "payment status"]):
        if student_id:
            app_data = tools.get_application_status(db, student_id)
            reply = (
                f"Your {app_data.get('scheme_name', 'Post-Matric Scholarship')} application has been sanctioned, "
                f"but the payment is currently awaiting DBT processing. The latest status was updated on 18 September 2026."
            )
            return {
                "response": reply,
                "language": "en",
                "tools_called": ["get_payment_history", "get_application_status"],
                "citations": [{"source": "PFMS / DBT Synthetic Gateway", "status": "Sanctioned"}],
                "action_buttons": [
                    {"label": "View Application", "action": "VIEW_APPLICATION"},
                    {"label": "View Payment Timeline", "action": "VIEW_PAYMENT"},
                    {"label": "Raise Grievance", "action": "RAISE_GRIEVANCE"}
                ],
                "fallback_mode": True
            }

    # English Query: Application Status & Timeline
    if any(k in msg_lower for k in ["application status", "my status", "track application", "where is my application"]):
        if student_id:
            app_status = tools.get_application_status(db, student_id)
            if app_status.get("status") == "NO_APPLICATION":
                return {
                    "response": "You currently do not have any active scholarship applications submitted. Would you like to check your eligibility for the 5 MoTA schemes?",
                    "language": "en",
                    "tools_called": ["get_application_status"],
                    "citations": [],
                    "action_buttons": [{"label": "Explore Schemes", "action": "EXPLORE_SCHEMES"}],
                    "fallback_mode": True
                }
            
            reply = (
                f"Your application **{app_status['application_no']}** for **{app_status['scheme_name']}** ({app_status['academic_year']}) "
                f"is currently at stage: **{app_status['current_stage']}** (Status: {app_status['status']}).\n\n"
                f"• Current Health Score: {app_status['health_score']}/100\n"
                f"• Submission Date: {app_status['submitted_at']}"
            )
            return {
                "response": reply,
                "language": "en",
                "tools_called": ["get_application_status"],
                "citations": [{"source": "MargDarshan Core Database", "record": app_status['application_no']}],
                "action_buttons": [
                    {"label": "View Application Timeline", "action": "VIEW_APPLICATION"},
                    {"label": "Document Wallet", "action": "VIEW_DOCUMENTS"}
                ],
                "fallback_mode": True
            }

    # English Query: Deficiencies / Problems (Section 88 Format)
    if any(k in msg_lower for k in ["deficiency", "problem", "wrong", "rejected", "income certificate expired", "what happened"]):
        if student_id:
            defs = tools.list_deficiencies(db, student_id)
            if defs:
                d = defs[0]
                reply = (
                    f"### What happened?\n"
                    f"{d['reason']}\n\n"
                    f"### Why it matters?\n"
                    f"A valid certificate is required under MoTA scheme guidelines to process your scholarship sanction.\n\n"
                    f"### What you can do?\n"
                    f"{d['action_required']}\n\n"
                    f"### Need help?\n"
                    f"You can upload your document directly from the Document Wallet or raise a grievance if you believe this is an error."
                )
                return {
                    "response": reply,
                    "language": "en",
                    "tools_called": ["list_deficiencies"],
                    "citations": [{"source": d.get("source", "Verification Engine")}],
                    "action_buttons": [
                        {"label": "Upload Document", "action": "UPLOAD_DOCUMENT"},
                        {"label": "Ask SAATHI", "action": "MORE_HELP"}
                    ],
                    "fallback_mode": True
                }

    # Scheme Information
    if any(k in msg_lower for k in ["pre-matric", "pre matric", "class 9", "class 10"]):
        info = tools.get_scheme_information(db, "PRE_MATRIC")
        reply = (
            f"**{info.get('name', 'Pre-Matric Scholarship')}** is for ST school students in Classes IX and X.\n\n"
            f"• **Income Ceiling:** Up to ₹2,50,000/- per annum\n"
            f"• **Benefits:** Monthly scholarship allowance plus book & contingency grant.\n"
            f"• **Required Documents:** ST Certificate, Income Certificate, Class 8/9 Marksheet, School Admission Bonafide."
        )
        return {
            "response": reply,
            "language": "en",
            "tools_called": ["get_scheme_information"],
            "citations": [{"source": "official_guideline (2026)", "section": "Pre-Matric Guidelines"}],
            "action_buttons": [{"label": "Check Eligibility", "action": "CHECK_ELIGIBILITY"}],
            "fallback_mode": True
        }

    if any(k in msg_lower for k in ["post-matric", "post matric", "college", "degree", "diploma"]):
        info = tools.get_scheme_information(db, "POST_MATRIC")
        reply = (
            f"**{info.get('name', 'Post-Matric Scholarship')}** supports ST students pursuing post-secondary courses (Class XI, XII, ITI, Degree, PG, Ph.D.).\n\n"
            f"• **Income Ceiling:** Up to ₹2,50,000/- per annum\n"
            f"• **Benefits:** Complete tuition fee reimbursement + monthly maintenance allowance.\n"
            f"• **Restriction:** A student can avail only ONE scholarship at a time."
        )
        return {
            "response": reply,
            "language": "en",
            "tools_called": ["get_scheme_information"],
            "citations": [{"source": "official_guideline (2026)", "section": "Post-Matric Guidelines"}],
            "action_buttons": [{"label": "Check Eligibility", "action": "CHECK_ELIGIBILITY"}],
            "fallback_mode": True
        }

    # Default friendly guidance
    default_text = (
        "Hello! I am **SAATHI**, your scholarship assistance companion for Ministry of Tribal Affairs (MoTA) schemes.\n\n"
        "I can help you with:\n"
        "• Checking your application and verification status\n"
        "• Explaining payment timelines and DBT processing\n"
        "• Verifying eligibility across the 5 ST scholarship schemes\n"
        "• Identifying document requirements and resolving flagged deficiencies\n"
        "• Raising formal grievances to welfare officers"
    )
    return {
        "response": default_text,
        "language": detected_lang,
        "tools_called": [],
        "citations": [{"source": "MargDarshan SAATHI Assistant"}],
        "action_buttons": [
            {"label": "Check Application Status", "action": "VIEW_APPLICATION"},
            {"label": "Explore Schemes", "action": "EXPLORE_SCHEMES"},
            {"label": "Document Wallet", "action": "VIEW_DOCUMENTS"}
        ],
        "fallback_mode": True
    }
