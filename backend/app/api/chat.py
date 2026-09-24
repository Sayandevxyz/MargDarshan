from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional

from backend.app.core.database import get_db
from backend.app.api.deps import get_current_user_optional
from backend.app.models.models import User
from backend.app.schemas.schemas import ChatMessageRequest, ChatMessageResponse
from backend.app.chatbot.agent import process_saathi_chat
from backend.app.chatbot import tools

router = APIRouter(prefix="/chat", tags=["SAATHI AI Assistant"])

@router.post("", response_model=ChatMessageResponse)
def chat_with_saathi(
    req: ChatMessageRequest,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    result = process_saathi_chat(
        db=db,
        message=req.message,
        user=user,
        preferred_lang=req.language
    )
    return ChatMessageResponse(
        response=result["response"],
        language=result["language"],
        tools_called=result.get("tools_called", []),
        citations=result.get("citations", []),
        action_buttons=result.get("action_buttons", []),
        fallback_mode=result.get("fallback_mode", False)
    )

@router.post("/tool")
def execute_saathi_tool(
    tool_name: str = Body(..., embed=True),
    arguments: Dict[str, Any] = Body(default={}, embed=True),
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    # Route tool execution
    if tool_name == "get_application_status":
        student_id = arguments.get("student_id")
        return tools.get_application_status(db, student_id)
    elif tool_name == "get_payment_history":
        student_id = arguments.get("student_id")
        return tools.get_payment_history(db, student_id)
    elif tool_name == "list_deficiencies":
        student_id = arguments.get("student_id")
        return tools.list_deficiencies(db, student_id)
    elif tool_name == "get_scheme_information":
        scheme_code = arguments.get("scheme_code", "POST_MATRIC")
        return tools.get_scheme_information(db, scheme_code)
    elif tool_name == "get_required_documents":
        scheme_code = arguments.get("scheme_code", "POST_MATRIC")
        return tools.get_required_documents(scheme_code)
    else:
        return {"error": f"Tool '{tool_name}' not recognized"}
