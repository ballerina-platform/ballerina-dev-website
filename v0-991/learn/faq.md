---
layout: ballerina-inner-page
title: FAQs
---

# FAQs

### What is the purpose of the project?
Ballerina is an approach to addressing the integration gap between integration products and general purpose programming languages.

Integration with ESBs is still waterfall development. The server must be deployed, connectors configured, service logic programmed with XML, and data querying and transformation with XPath. This is not developer friendly.

Programming languages with frameworks like Spring and Node.js offer agility, but do not make it simple to program distributed system constructs with concurrency models not suited for sequence parallelization.

Ballerina is a compiled, transactional, statically and strongly typed programming language with textual and graphical syntaxes. Ballerina incorporates fundamental concepts of distributed system integration into the language and offers a type safe, concurrent environment to implement microservices with distributed transactions, reliable messaging, stream processing, and workflows.

Ballerina’s concurrency model is built on the sequence diagram metaphor and offers simple constructs for writing concurrent programs. Its type system is a modern type system designed with sufficient power to describe data that occurs in distributed applications. It also includes a distributed security architecture to make it easier to write applications that are secure by design.

Ballerina is designed for modern development practices with a modularity architecture based on modules that are easily shared widely. Version management, dependency management, testing, documentation, building and sharing are part of the language design architecture and not left for later add-on tools.

The Ballerina standard library is in two parts: the usual standard library level functionality (akin to libc) and a standard library of network protocols, interface standards, data formats, authentication/authorization standards that make writing secure, resilient distributed applications significantly easier than with other languages.

Ballerina has been inspired by Java, Go, C, C++, Rust, Haskell, Kotlin, Dart, Typescript, Javascript, Swift and other languages.

### What is the status of the project?

Ballerina became a public open source project on February 21s, 2017, hosted at [http://ballerinalang.org](http://ballerinalang.org) and [http://github.com/ballerinalang/ballerina](http://github.com/ballerinalang/ballerina).

Through 2017 and the first part of 2018, the language was redesigned based upon feedback from the community. In Q2 2018, Ballerina was moved to [http://ballerina.io](http://ballerina.io) and [http://github.com/ballerina-platform/](http://github.com/ballerina-platform).

The current revision of Ballerina is pre-1.0. However, stability is happening quickly, and the .990.0 version is a candidate for 1.0 language-lock. We anticipate that the language changes leading up to the 1.0 release will be increasingly minor moving forward.

The Ballerina project is currently working towards Ballerina 1.0, which includes a language specification, a virtual machine, standard libraries, build management, centralized module management at [central.ballerina.io](central.ballerina.io), unit test framework, and observability extension.

Ballerina is currently community supported on Stack Overflow, and WSO2 now offers early access development support for Ballerina.

There may be a Ballerina 2.0 specification in many years, though we will instead focus on iterative improvement around the language with long term 1.0 language backwards compatibility. Our focus will be on using Ballerina to develop programs, products, and tools rather than actively changing the language and libraries. The purpose of Ballerina 1.0 is to provide long-term stability. Backwards-incompatible changes will not be made to any Ballerina 1.0 point release. Of course, development will continue on Ballerina itself, but the focus will be on performance, reliability, portability and the addition of new functionality, such as streams and stateful orchestrations.

### What is the origin of the logo?

The Ballerina logo and the shoes, which are “en pointe”, were designed by Eric and Christine Strohl, of [StrohlSF.com](http://strohlsf.com).

### Why are you creating a new language?

Ballerina was born out of frustration with programming frameworks and integration products that embed programming logic within YAML, XML, or other configuration-based files. These approaches disrupted the developer flow, requiring special purpose tools and debuggers that took developers away from focusing on iterative development.

One had to either choose robust, complex, and heavy server products for managing integrations, or use a general purpose language with a framework that varied by programming language and objectives. There has not existed a way to get agility with rapid code development that runs microintegration servers for message brokering, service hosting, and transaction coordination.

Ballerina is an attempt to combine the agility of a type safe programming language with the syntax of integration sequence diagrams. Once compiled, the resulting binaries embed micro engines that perform inline integration semantics such as mediation, orchestration, transformations, asynchrony, event generation and transactions.

Finally, working with Ballerina is intended to be cloud native - the language has constructs that define the architectural environment so the compiler understands the logical environment the application will be running within. This enables the compiler to generate numerous runtime environment artifacts that are typically generated by continuous integration solutions.

### What are Ballerina’s ancestors?

In the creation of Ballerina, we were inspired by so many technologies. Thank you to all that have come before us (and forgive us if we missed one): Java, Go, C, C++, Rust, Haskell, Kotlin, Dart, TypeScript, JavaScript, Flow, Swift, RelaxNG, NPM, Crates, Maven, Gradle, Kubernetes, Docker, Envoy, Markdown, GitHub, and WSO2. However, it is a new language. In every respect the language was designed by thinking about what integration programmers do and how to make integration programming agile, more effective, and more fun.

### What are the guiding principles in the design?

##### Sequence Diagrammatic
Ballerina’s underlying language semantics were designed by modeling how independent parties communicate via structured interactions. Subsequently, every Ballerina program can be displayed as a sequence diagram of its flow with endpoints, including synchronous and asynchronous calls. Sequence diagrams are a reflection of how designers and architects think and document interconnected systems. Ballerina’s syntax is structured to let any tool or system derive a sequence diagram, and subsequently the way a developer thinks when writing Ballerina code encourages strong interaction best practices. This theory is elaborated upon in [Sanjiva Weerawarana’s blog](https://medium.com/ballerinalang/conceiving-ballerina-2dadf67c0503).

##### Concurrency Workers
Ballerina’s execution model is composed of lightweight parallel execution units known as workers. Workers use a full non-blocking policy where no function locks an executing thread, such as an HTTP I/O call awaiting response. These semantics manifest sequence concurrency where workers are independent concurrent actors that do not share state but can interact using messages. Workers and fork/wait language semantics abstract the underlying non-blocking approach to enable a simpler concurrency programming model.

##### Network Aware Type Safety
Ballerina has a structural type system with primitive, object, union, and tuple types. Network systems return messages with different payload types and errors. Ballerina’s type system embraces this variability with an approach based on union types. This typesafe model incorporates type inference at assignment provide numerous compile time integrity checks for network-bound payloads.

##### DevOps Ready
Over the past 15 years, best practices and expectations on the associated toolset that a language provides have evolved. Now, a language is not ready for adoption unless it includes unit test framework, build system, dependency management and versioning, and a way to share modules of reusable code. Ballerina includes all of these subsystems as part of its core distribution so that there is no risk of community drift, which is what happens when the ecosystem needs to build tools on top of a language instead of designing it within the language.

##### Environment Aware 
Ballerina the language and its components are intended to be used within distributed, event-driven architectures. Subsequently, each service written within Ballerina is residing in an environment that may also include other services, legacy services, service meshes, orchestrators, API gateways, identity gateways, message brokers and databases. Ballerina’s language and annotations extension are intentionally environment-aware, treating these other components as syntactical objects and also relationships as decorated annotations. By having the language and build system be environmentally aware of other components surrounding our service, we can generate essential artifact code ahead of CI/CD, perform data and integrity checks around network-bound payloads, and pre-package dependent but not yet deployed components as part of the Ballerina binary.

### How does Ballerina compare to Spring?
Ballerina is a modern programming language that has a concise way of programming interaction scenarios. Its syntax represents the powerful elements of what Java, Spring, and Spring Cloud offer separately. Additionally, Spring requires developers to choose and configure a separate build system (maven or gradle), unit test framework, registry for sharing modules, and deployment artifact generation. The nature of agile programming has evolved where these lifecycle concepts for microservices are well understood and their best practices are baked into Ballerina in the form of Ballerina’s build system, Ballerina Central, Testerina and Docker / Kubernetes artifact generation during build.

### Given Ballerina is a programming language what about frameworks like Spring? Why should our Java developers learn another language?
Unlike Spring, Ballerina is both agile and integration simple. While general purpose programming languages make software development agile, developers must still take responsibility for the hard problems of integration by writing their own integration logic or  frameworks like Spring. This approach is not integration simple.

In this sense, Ballerina is the language, the framework, the runtimes, the gateway, the circuit breaker, the message broker, and transaction coordinator all rolled into a single design and implementation.

Developers will always have their favorite language of choice. However, in a polyglot world where services are disaggregating, there is potential for a new language that makes it easier to be the glue between endpoints written in any language, including Java and Spring, with a shorter learning curve. We think Ballerina can play a role as part of the glue.

### How does Ballerina compare to a Service Mesh like Istio?

Service meshes exist to make it easier to write resilient distributed systems. They apply transaction resilience at the network request level and Ballerina applies it within the logic level. Ballerina works both with and without a service mesh! In situations where a service mesh is not present, Ballerina provides network bridging and transaction management for invocations in between services written with Ballerina or integrated via the Ballerina Bridge. In situations where a service mesh already exists, Ballerina services can be configured to delegate routing and transaction capabilities to the underlying mesh.

### Will you accept my language change?

People often suggest improvements to the language - the developer mailing list contains a rich history of such discussions, but very few of these changes have been accepted.

Although Ballerina is an open source project, the language and libraries are protected by a compatibility standard that prevents changes that break existing programs. If your proposal violates the Ballerina 1.0 specification we cannot entertain the idea, regardless of its merit. A future major release of Ballerina may be incompatible with Ballerina 1.0, but we’re not ready to start talking about that idea as we are still working towards long term stability of Ballerina 1.0!

Even if your proposal is compatible with Ballerina 1.0 specification, it might not be in the spirit of Ballerina’s design goals. The language designers are generous with their time in elaborating on the various design intentions to help provide deeper background on its history and direction.

### What is the roadmap for Ballerina?

The roadmap is driven by separate teams working on aspects of the language and platform. The key themes that are driving development teams are 1.0 language lock, commercial supportability, runtime and platform enhancements, and developer / integration tooling that includes Central, ballerinax/* modules, Ballerina API gateway, Ballerina transaction coordinator, and workflow. 

1. The language
* Language lock, stability
* Community review of language specification
* Language test suite 
* Merging / collapsing sequence diagrams

2. the BVM runtime, performance, etc.
* LLVM prototype, Native compilation via LLVM
* Longevity, stability, performance optimizations
* Build system rationalization - common output
* Build system - environment-specific builds
* Internationalizing the grammar

3. Standard library
* Enhance the seamless operation of cross platform behavior 
* Expand the list of supported database management systems 

4. Extension / ecosystem improvements, such as Ballerina Central, registry, modules, customization
* Private version of Ballerina registry, powering Ballerina Central
* Ability to write compiler extensions packaged with Ballerina modules
* Ability to push compiled Ballerina programs into a registry (not just modules)

5. Integration related things around API gateway, message broker, transaction coordinator
* Persistent and stateful services, ie "workflow"
* Streaming SQL
* API throttling support and API observability around API gateway 
* Optimize transaction model to support distributed transactions with MB
* Transaction coordination - more coordination patterns will be introduced 
* In relation to workflow we plan checkpoint/restart, forward recoverability and compensation
* Docker / Kubernetes compositions

6. Tooling
* Observability integration into composer to facilitate tracing
* Heterogeneous data transformations

### Does WSO2 use Ballerina internally?

Yes!

There are several Ballerina programs deployed in production inside WSO2. A public example is the server behind central.ballerina.io. Its module management interfaces were built as Ballerina services and then deployed as containers on Google’s Kubernetes engine.

Other examples include the WSO2 Update Manager, which WSO2 customers use to access WSO2 software and  WSO2’s API Manager gateway component.

### Can I translate the Ballerina home page into another language?
Absolutely. We encourage developers to make Ballerina language sites in their own languages. You can issue pull requests and we’ll host the translated versions at ballerina.io.

### Will Testerina automatically generate service mocks?
Yes, it generates mocks when OpenApi is present.

### Which Ballerina connectors are currently available?
The best place to see the latest set of connectors is Ballerina Central at [central.ballerina.io](http://central.ballerina.io), or by using `ballerina search` on the command line.

You can also write your own Ballerina connectors, maintain them locally, or push them into Ballerina Central.

The Ballerina team and WSO2 are publishing a series of additional modules around Twitter, Gmail, Github, Salesforce.com, and others. You can browse the modules that WSO2 is publishing by viewing the [http://github.com/wso2-ballerina](http://github.com/wso2-ballerina) organization. Each repository is an additional module we are shipping.

### Are there any restrictions for third parties in publishing modules to Ballerina Central?
Ballerina Central is open for anyone to push modules that contain annotations, builder extensions, functions, and connectors. We have a terms of service similar to what NPM or DockerHub has on their site. You should review the TOS to understand which type of content is accessible. Module authors retain a number of rights related to their modules and can choose any license for their software.

### Is there a way to run a private registry for Ballerina modules?
Ballerina Central is implemented as a hosted registry service. WSO2 is offering an option to host private registries that are optionally mirrored to Ballerina Central.

### How can I decouple and manage deployment environment details outside the implementation?
You can override the values in annotations on the command line, enabling the build system to generate different artifacts for different environments. In a future version of Ballerina, we'll also extend the `Ballerina.toml` with environmental overrides so that you can generate artifacts for multiple environments simultaneously.

### What analytics and monitoring does Ballerina support?
For details, see the [How to Observe Ballerina Programs](/learn/how-to-observe-ballerina-code/) document.

### What are the secure coding guidelines?

For details, see the [How to Secure Ballerina Programs](/learn/how-to-write-secure-ballerina-code/) document on [ballerina.io](http://ballerina.io).

### How can we integrate legacy code (written on Java or other languages) with Ballerina?

[Ballerina Bridge](https://github.com/ballerina-platform/ballerina-bridge) is a project within the Ballerina organization that provides a containerized sidecar that is able to bridge legacy services to work with Ballerina transactions. The sidecar connects to the legacy service over localhost and bridges the transaction initiated by a Ballerina service with the internal transaction semantics of the legacy service managed by the sidecar.

### What build tools should be used for large projects with Ballerina?

Ballerina ships with its own build system and module management.

### What are the recommendations on Continuous Integration / Continuous Delivery and Application Lifecycle Management for Ballerina? How do you track requirements to test results traceability with Ballerina? What DevOps tools are available for Ballerina?

Development teams should continue to use their favorite or existing lifecycle solutions. Ballerina works with all of them. Though we will note that because Ballerina is able to generate deployment artifacts during compilation and run its own unit tests, there are many phases of iterative development which can be done directly by Ballerina instead of using the traditional CI/CD.

### What are the best practices for versioning Ballerina based applications?

We require Ballerina modules to follow [semver](http://semver.org) semantics. If you are creating a shared module that is pushed into a Ballerina registry, like [Ballerina Central](http://central.ballerina.io), every push requires a versioning increment. We do not allow updates to an existing version as this creates confusion and difficulties with downstream adopters.

### What are the guidelines for application governance with Ballerina?

Ballerina creates services with APIs. These services can be governed using your organizations best practices. We would encourage you to consider WSO2 API Manager as a leading governance and lifecycle product for APIs.

### What are the best practices for testing Ballerina based projects?

Ballerina ships with Testerina, a built-in mechanism for running unit tests against hosted services. For integration and system tests, Ballerina works with your existing lifecycle management solutions.

### How do you write testable and maintainable code with Ballerina?

For details, see [How to Structure Ballerina Code](/learn/how-to-structure-ballerina-code/) and [How to Test Ballerina Code](/learn/how-to-test-ballerina-code/).

### Can we embed our legacy libraries with Ballerina?

Legacy libraries cannot be linked to a Ballerina program.

However, you can make your legacy libraries into microservices and then invoke them over the network The [Ballerina Bridge](https://github.com/ballerina-platform/ballerina-bridge) enables legacy services to participate in transactions with other Ballerina services for this purpose.

### Will business designers be able to do graphical GUI development still? How can we keep the design to code alignment with Ballerina?

Yes, it is entirely possible for business designers to use Ballerina IDE plugins to use graphical constructs to create Ballerina services.

Ballerina’s syntax is structured to represent the core constructs of integration. By designing the keywords and the language layout using integration semantics, it is possible for IDEs to provide a graphical representation of the code that is identical to a sequence or interaction diagram in UML. This diagram does not require intermediate formats or translation. The IDE plugins can be used to generate new code in your Ballerina files through drag and drop, provide a visualization to others that document how your code interacts with other endpoints, and to provide dev tracing flows of interactions during debugging.

### What forms of debugging does Ballerina support?

Ballerina has command-line debugger support which integrates into your favorite IDE. You can also perform graphical debugging within Ballerina Composer. Ballerina services have transaction tracing information collected which can be sent to product that provides runtime observability.

### Do you have any benchmarks that compare Ballerina with other languages?

We do not have any yet.

### What is the footprint?

The memory footprint depends on the use case and the load. A simple Ballerina service which simultaneously serves 500 concurrent users will have a low memory footprint of  50 MB. A ballerina `main()` program with simple logic (such as a loop counter) consumes 15  MB.

### What is the update process for Ballerina? What is the update frequency?

We will update Ballerina once / month with a community release. These releases will require a roll-forward support requirement. Ballerina will have levels of language backwards compatibility commitments so that adopters can depend upon stability. When WSO2 releases commercial support we will have a binary patch model that works against older versions of Ballerina.

### How do I report security vulnerabilities?

See [http://ballerina.io/security](http://ballerina.io/security).

### Can I write my MVC app with Ballerina?

Ballerina does not currently have an MVC framework. We’d love for the community to add one and publish on Ballerina Central. Ballerina’s object and record model makes it easy to synchronize data and models.

### Is this more functional than object oriented?

Ballerina is a modern language that attempts to bring together productive features of functional, imperative, and object-oriented programming.

### Is Ballerina an object-oriented language?

Both `objects` (`types`) and `functions` are first class constructs in Ballerina. Developers have the flexibility to choose the most appropriate option depending on the requirement.

While Ballerina has `objects` it can technically be designated an OOP, however, development methodology is not predominantly OOP-based. The design principles are based on sequence diagramming concepts that include declarative elements that are not purely OOP.

### Why is there no type inheritance?

Ballerina is based on type equivalence, rather than type inheritance. The type system in Ballerina is based on set theory and, therefore, type equivalence has more meaning for this domain than type inheritance.

### Why does Ballerina not support overloading of methods and operators?

This is for simplicity purposes.

In Ballerina, functions can be defined with required parameters, defaultable parameters, and optional rest parameters. Ballerina supports calling defaultable parameters in any order by passing explicit `name=value` on invocation, and this approach cannot be combined with parameter overloading. We felt that this model offered module designers and developers more flexibility than overloading.

Ballerina also supports the use of function name as a function pointer. This makes it easy to understand code because there is a single function corresponding to a given function name and is more powerful than the use of function overloading.

For more information on the function pointer syntax, see the [Function Pointer example](/learn/by-example/function-pointers.html).

### What compiler technology is used to build the compiler?

The Ballerina compiler is written in Java with a generated LL parser using ANTLR4. It generates binary files containing a Ballerina bytecode format that is platform neutral and different than Java’s bytecode.

Ballerina compiler is a multi-pass compiler with stages for lexical and syntax analysis, semantic analysis, code analysis, desugar (remove syntactic sugar), and code generation.

### How is the runtime support implemented?

Ballerina has a virtual machine (BVM) that executes Ballerina byte code instructions. You can run both source files and compiled byte code files with BVM.

The runtime consists of an interpreter, a primitive type system, support for objects, methods and functions, and a parallel programming model based on workers. The capabilities are extended with a standard library, set of endpoints plus transports, and built-in models for documentation, testing, observability, secure coding, event streams and transactions.

### Why is my trivial service such a large binary?

The linker in the Ballerina toolchain creates statically-linked binaries by default. All Ballerina binaries therefore include the Ballerina runtime, along with the runtime type information to support type checks, panic-time stack traces, observability metrics.

A simple Ballerina 'hello, world' program compiled and linked statically is around 600 kB.

### What is the concurrency/threading model?

Ballerina's runtime implements a virtual machine that executes the Ballerina bytecode, which is called the BVM.

The BVM's execution model is made up of lightweight parallel execution units known as "workers". A worker is a lightweight parallel execution unit. Every function or network action defines one or more workers to execute its logic, and each has its own lifecycle consisting of worker states such as `READY`, `RUNNING`, and `WAITING_FOR_RESPONSE`.

A worker is not bound exclusively to a single operating system thread, but rather, it uses full non-blocking policy, where it will never block an executing thread if the worker is not actively using it. This is controlled by the scheduler in the BVM, which coordinates the worker executions with the physical threads. For example, I/O operations such as HTTP calls will release the physical threads and only after the I/O response is available will the worker resume.

This behavior gives a more natural programming environment for the developer, so she does not have to explicitly consider non-blocking I/O handling semantics. Also, this style of physical thread allocation is efficient and lowers the number of context switches optimizing CPU allocations.

### Would you provide NLP, ML toolkits around Ballerina?
We do not have any plans. The community can add their own modules through Ballerina Central, and we will work hard to delegate frameworks and projects to the community.

### Which enterprise patterns and microservices patterns does Ballerina support?
Ballerina is a language that can be used to implement any pattern. We provide examples of patterns with [Ballerina By Guide](/learn/by-guide/) related to doing lifecycle integration development. Many enterprise patterns are demonstrated with [Ballerina by Example](/learn/by-example/).

### What is your support for Docker and Kubernetes? What is the plan for supporting other infrastructure environments like CloudFoundry and Mesosphere?
We provide annotations that activate builder extensions which can generate Dockerfiles, Docker images, and Kubernetes manifests. This makes it simple to target a service for deployment in a cloud-native environment. These annotations and extensions are provided within modules. Modules are shareable units and we will work with the ecosystem to create and push modules to support other environments with custom annotations. 