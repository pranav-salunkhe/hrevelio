# What problem does hrevelio solve?
Code quality and developer experience are two major areas one should focus when writing code irrespective of team setting or solo development. To understand the importance of code quality consider NASA's embedded systems, they have (low level language) code which is generally loosely coupled. The code is written to ensure it performs the expected task in a remote isolated environment. To ensure this, NASA employs various practices one of them being, evaluation of code's quality based on Halstead complexity metrics. These metrics give you an overall idea of how well the code is:

- Documented (Comments)
- Modularized (Nesting, Single-Responsibility Principle etc)
- Complexity (Vocabulary, number of operators etc)
- Cyclomatic Complexity (Indicates how difficult it might be to test, maintain, troubleshoot, and produce errors)
- Developer Experience (length of code, cognitive challenges etc)
and few more.

When working in a team setting, the codebase is altered by dozens of past developers and will keep on changing overtime. To ensure the code meets the above listed requirements, I decided to build Hrevelio, an automated tool that, based on your input code, would give you an analysis of how well your code is in terms of Halstead measures and which sections of your code are critical(i.e. need improvement) with reasoning and actionable feedback. This would help developers learn and improve their coding acumen. We further help the user to optimize their code to ensure optimal range of halstead measures. But the cycle doesn't just end once you have an optimal code. Testing your code is of utmost importance. Thus, the app generates testcases based on your code's business requirements. I orchestrated the entire workflow using Orkes Conductor.

# Setup

1. Clone the repo
`git clone https://github.com/pranav-salunkhe/hrevelio`
2. Install dependencies
`npm i`
3. Adding the following environment variables
```
OPENAI_API_KEY=<key>
CONDUCTOR_ID=<key>
CONDUCTOR_SECRET=<key>
```
> Make sure to change the conductor url. It uses playground by default.
4. Run
`npm run dev`

# Challenges I ran into
I ran into several bugs while developing this project. Below are some of them:

**Ensuring structured consistent responses from the AI**: LLMs are very generic unless fine-tuned. I managed to get consistent structured response from every query by passing a zod schema to the LLM. I tailored the schema according to the data expected at different routes while preserving the entire previous chat's context.

**Conductor Polling to avoid rate-limits**: I orchestrated the entire workflow from analysis to testcase suggestion. This helped me leverage conductor's HTTP polling to send a request to OpenAI only after a valid response was fetched. This helped to avoid hitting rate limits.

# Tech stack

- Next.js
- TypeScript
- OpenAi
- Tailwind CSS
- Monaco Editor
- MantineUI
- Orkes Conductor
