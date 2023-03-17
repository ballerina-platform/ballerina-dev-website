```
service / on new http:Listener(9090) {
    resource function post products() returns int|error {
        // Get the product details from the last inserted row of the Google Sheet.
        sheets:Range range = check gsheets->getRange(googleSheetId, "Sheet1", "A2:F");
        var [name, benefits, features, productType] = getProduct(range);

        // Generate a product description from OpenAI for a given product name.
        text:CreateCompletionRequest textPrompt = {
            prompt: string `generate a product descirption in 250 words about ${name}`,
            model: "text-davinci-003",
            max_tokens: 100
        };

        text:CreateCompletionResponse completionRes = 
            check openAIText->/completions.post(textPrompt);

        // Generate a product image from OpenAI for the given product.
        images:CreateImageRequest imagePrmt = {
            prompt: string `${name}, 
            ${benefits}, 
            ${features}`
        };
        images:ImagesResponse imageRes = 
            check openAIImages->/images/generations.post(imagePrmt);

        // Create a product in Shopify.
        shopify:CreateProduct product = {
            product: {
                title: name,
                body_html: completionRes.choices[0].text,
                tags: features,
                product_type: productType,
                images: [{src: imageRes.data[0].url}]
            }
        };
        shopify:ProductObject prodObj = check shopify->createProduct(product);
        int? pid = prodObj?.product?.id;
        if pid is () {
            return error("Error in creating product in Shopify");
        }
        return pid;
    }
}
```