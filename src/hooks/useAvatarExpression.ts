import { useState, useEffect } from "react";

type Expression = "neutral" | "happy" | "thinking" | "excited";

export function useAvatarExpression() {
  const [expression, setExpression] = useState<Expression>("neutral");

  const detectExpression = (text: string): Expression => {
    const lowerText = text.toLowerCase();
    
    // Excited expressions
    if (
      lowerText.includes("wow") ||
      lowerText.includes("amazing") ||
      lowerText.includes("incredible") ||
      lowerText.includes("fantastic") ||
      lowerText.includes("!") && lowerText.split("!").length > 2
    ) {
      return "excited";
    }
    
    // Happy expressions
    if (
      lowerText.includes("great") ||
      lowerText.includes("wonderful") ||
      lowerText.includes("nice") ||
      lowerText.includes("good job") ||
      lowerText.includes("😊") ||
      lowerText.includes("🎉")
    ) {
      return "happy";
    }
    
    // Thinking expressions
    if (
      lowerText.includes("let me think") ||
      lowerText.includes("interesting question") ||
      lowerText.includes("hmm") ||
      lowerText.includes("that's a good question") ||
      lowerText.includes("🤔")
    ) {
      return "thinking";
    }
    
    return "neutral";
  };

  const updateExpression = (text: string) => {
    const newExpression = detectExpression(text);
    setExpression(newExpression);
    
    // Auto-reset to neutral after 3 seconds
    if (newExpression !== "neutral") {
      setTimeout(() => setExpression("neutral"), 3000);
    }
  };

  const setManualExpression = (expr: Expression) => {
    setExpression(expr);
  };

  return {
    expression,
    updateExpression,
    setManualExpression,
  };
}