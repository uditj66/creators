"use server";
import { GoogleGenAI } from "@google/genai";

const google = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Define a consistent return type for your frontend
export type GenerateBlogResponse = {
  success: boolean;
  content?: string; // Only present if success is true
  error?: string; // Only present if success is false
};

export async function generateBlogContent(
  title: string,
  category: string = "",
  tags: string[] = []
): Promise<GenerateBlogResponse> {
  // Explicit return type

  if (!title || title.trim().length === 0) {
    return { success: false, error: "Title is Required" };
  }

  try {
    const prompt = `
      Write a comprehensive blog post with the title: "${title}"
      ${category ? `Category: ${category}` : ""}
      ${tags.length > 0 ? `Tags: ${tags.join(", ")}` : ""}

      Requirements:
- Write engaging, informative content that matches the title
- Use proper HTML formatting with headers (h2, h3), paragraphs, lists, and emphasis
- Include 3-5 main sections with clear subheadings
- Write in a conversational yet professional tone
- Make it approximately 800-1200 words
- Include practical insights, examples, or actionable advice where relevant
- Use <h2> for main sections and <h3> for subsections
- Use <p> tags for paragraphs
- Use <ul> and <li> for bullet points when appropriate
- Use <strong> and <em> for emphasis
- Ensure the content is original and valuable to readers

Do not include the title in the content as it will be added separately.
Start directly with the introduction paragraph.
`;

    const response = await google.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    // ✅ FIX: Return an object that matches your error structure
    // We also use || "" to ensure we never return undefined
    return {
      success: true,
      content: response.text || "",
    };
  } catch (error: any) {
    console.error("Error generating blog:", error);

    let errorMessage = "Failed to generate content. Please try again.";

    if (error.message?.includes("API key")) {
      errorMessage = "AI service configuration error. Please try again later.";
    } else if (
      error.message?.includes("quota") ||
      error.message?.includes("limit")
    ) {
      errorMessage =
        "AI service is temporarily unavailable. Please try again later.";
    }

    // ✅ This now matches the return type of the success block
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Modifying Content

export async function improveContent(
  currentContent: string,
  improvement: string = "enhance"
): Promise<GenerateBlogResponse> {
  if (!currentContent || currentContent.trim().length === 0) {
    return { success: false, error: "Content is required" };
  }
  try {
    let prompt = "";
    switch (improvement) {
      case "expand":
        prompt = `
Take this blog content and expand it with more details, examples, and insights:

${currentContent}

Requirements:
- Keep the existing structure and main points
- Add more depth and detail to each section
- Include practical examples and insights
- Maintain the original tone and style
- Return the improved content in the same HTML format
`;
        break;

      case "simplify":
        prompt = `
Take this blog content and make it more concise and easier to read:

${currentContent}

Requirements:
- Keep all main points but make them clearer
- Remove unnecessary complexity
- Use simpler language where possible
- Maintain the HTML formatting
- Keep the essential information
`;
        break;

      default: // enhance
        prompt = `
Improve this blog content by making it more engaging and well-structured:

${currentContent}

Requirements:
- Improve the flow and readability
- Add engaging transitions between sections
- Enhance with better examples or explanations
- Maintain the original HTML structure
- Keep the same length approximately
- Make it more compelling to read
`;
    }
    const response = await google.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return {
      success: true,
      content: response.text || "",
    };
  } catch (error: any) {
    console.error("Content improvement error:", error);
    let errorMessage = "Failed to improve content. Please try again.";

    if (error.message?.includes("API key")) {
      errorMessage = "Configuration error. Please contact support.";
    } else if (
      error.message?.includes("quota") ||
      error.message?.includes("limit")
    ) {
      errorMessage = "Service is busy. Please try again in a moment.";
    }
    return {
      success: false,
      error: error.message || "Failed to improve content. Please try again.",
    };
  }
}
