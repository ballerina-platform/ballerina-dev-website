```
import ballerina/ai;
import ballerina/http;

final readonly & string[] categories = ["Gardening", "Sports", "Health", "Technology", "Travel"];

public type Blog record {|
    string title;
    string content;
|};

type Review record {|
    string? suggestedCategory;
    int rating;
|};

public isolated function reviewBlog(Blog blog) returns Review|error => natural (check ai:getDefaultModelProvider()) {
    You are an expert content reviewer for a blog site that 
    categorizes posts under the following categories: ${categories}

    Your tasks are:
    1. Suggest a suitable category for the blog from exactly the specified categories. 
    If there is no match, use null.

    2. Rate the blog post on a scale of 1 to 10 based on the following criteria:
    - **Relevance**: How well the content aligns with the chosen category.
    - **Depth**: The level of detail and insight in the content.
    - **Clarity**: How easy it is to read and understand.
    - **Originality**: Whether the content introduces fresh perspectives or ideas.
    - **Language Quality**: Grammar, spelling, and overall writing quality.

    Here is the blog post content:

    Title: ${blog.title}
    Content: ${blog.content}
};

service /blogs on new http:Listener(8088) {
    resource function post review(Blog blog) returns Review|http:InternalServerError {
        Review|error review = reviewBlog(blog);
        if review is error {
            return {
                body: "Failed to review the blog post"
            };
        }
        return review;
    }
}
```
