
# Project Context: [Project Name]

## 1. Role & Persona

Define how the AI should act. 
*Example: "You are a Senior Backend Engineer specializing in high-performance Python and FastAPI. You write clean, idiomatic code following PEP 8."*

## 2. Tech Stack & Environment

List the specific versions to prevent the AI from suggesting outdated syntax.

* **Language:** Python 3.12+
* **Framework:** FastAPI
* **Database:** PostgreSQL with SQLAlchemy 2.0
* **Testing:** Pytest
* **Linting:** Ruff

## 3. Architecture & Design Patterns

Tell the AI how the code is organized so it doesn't suggest "spaghetti" code.

* **Pattern:** We use Dependency Injection for all service layers.
* **Folder Structure:**
  * `/app/api`: Routing logic
  * `/app/services`: Business logic (no DB calls here)
  * `/app/core`: Config and DI containers
* **Constraint:** Never instantiate a database session inside a service; always inject it.

## 4. Coding Standards (The "Rules")

This is the most important section. Be explicit about what you **hate** and what you **love**.

* **No Type Hinting?** No, always use strict Type Hints.
* **Error Handling:** Use custom exception classes; do not return raw strings for errors.
* **Async:** Use `async/await` for all I/O bound operations.
* **Testing:** Every new feature must include a corresponding `pytest` file in `/tests`.

## 5. Common Pitfalls to Avoid

* Avoid using `print()` for logging; use the `logging` module.
* Do not use `os.path`; use `pathlib`.

* Avoid large functions; keep them under 30 lines.

---

### Senior Engineer Pro-Tips for Writing These Files

#### 1. Be Declarative, Not Conversational

Don't say: *"I would really like it if you could try to use async."*
Do say: *"**Requirement:** All I/O operations must be `async`."*

#### 2. Use "Negative Constraints"

LLMs often default to the most common (but often mediocre) way of doing things. You must explicitly forbid them.

* *Example: "DO NOT use `requests` library. Use `httpx` for all HTTP calls."*
* 

#### 3. Use Markdown Headers

The LLM uses the `#` headers to understand the hierarchy of your instructions. Use them to separate "Environment" from "Coding Style."

#### 4. The "Few-Shot" Technique (Optional but Powerful)

If you have a very specific way of writing a component, include a small snippet of "Good Code" inside the `.md` file.

```markdown
## Example Pattern
Always follow this pattern for Services:
```python
class UserService:
    def __init__(self, db: Session):
        self.db = db
```
