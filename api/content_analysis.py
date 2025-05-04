# content_analysis.py
from chatbot import get_llm, ChatPromptTemplate, LLMChain
from typing import Tuple

def detect_harmful_content(content: str) -> Tuple[bool, str]:
    """
    Analyze journal content for harmful keywords or sentiments.
    Returns a tuple of (is_harmful, reason).
    """
    llm = get_llm()
    
    prompt_template = ChatPromptTemplate.from_template(
        """You are a mental health assistant for CalmVerse. Analyze the following journal entry for potentially harmful content, such as mentions of suicide, self-harm, or intent to harm others. If harmful content is detected, provide a brief reason why it was flagged. If no harmful content is detected, return 'No harmful content detected'.

        Journal entry:
        "{content}"

        Format your response as:
        DETECTED: [True/False]
        REASON: [Reason for flagging or 'No harmful content detected']
        """
    )
    
    chain = LLMChain(llm=llm, prompt=prompt_template)
    
    try:
        result = chain.run(content=content).strip()
        lines = result.split('\n')
        is_harmful = False
        reason = "No harmful content detected"
        
        for line in lines:
            if line.startswith("DETECTED:"):
                is_harmful = line[9:].strip().lower() == "true"
            elif line.startswith("REASON:"):
                reason = line[7:].strip()
                
        return is_harmful, reason
    except Exception as e:
        print(f"Error in content analysis: {str(e)}")
        return False, "Analysis failed"