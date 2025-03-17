```
import ballerinax/np;
import ballerina/io;

final readonly & string[] categories = ["Gardening", "Sports", "Health", "Technology", "Travel"];

public type Blog record {|
    string title;
    string content;
|};

type Review record {|
    string? suggestedCategory;
    int rating;
|};

final readonly & Blog blog1 = {
    title: "Tips for Growing a Beautiful Garden",
    content: string `Spring is the perfect time to start your garden. 
        Begin by preparing your soil with organic compost and ensure proper drainage. 
        Choose plants suitable for your climate zone, and remember to water them regularly. 
        Don't forget to mulch to retain moisture and prevent weeds.`
};

final readonly & Blog blog2 = {
    title: "Essential Tips for Sports Performance",
    content: string `Success in sports requires dedicated preparation and training.
        Begin by establishing a proper warm-up routine and maintaining good form.
        Choose the right equipment for your sport, and stay consistent with training.
        Don't forget to maintain proper hydration and nutrition for optimal performance.`
};

public isolated function reviewBlog(
    Blog blog,
    np:Prompt prompt = `You are an expert content reviewer for a blog site that 
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
        Content: ${blog.content}`) returns Review|error = @np:NaturalFunction external;

public function main() returns error? {
    Review reviewBlog1 = check reviewBlog(blog1);
    io:println("Blog 1 Review: ", reviewBlog1);

    Review reviewBlog2 = check reviewBlog(blog2);
    io:println("Blog 2 Review: ", reviewBlog2);
}
```
