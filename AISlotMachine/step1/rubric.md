# CSE110 SP26: AI Slot Machine Experiment - Evaluation Rubric

Rubric for grading the 50 Claude Code runs. Score each area 1 (lowest) to 5 (highest).

## Area 1: Code Architecture (Fast & Inexpensive)
*(Is the code organized? Does it run fast and save compute/tokens?)*
* **1 - Unacceptable:** Just one giant file. Total spaghetti code. Slow and expensive to run.
* **2 - Poor:** Barely organized. Repeats itself a lot. Wastes resources.
* **3 - Acceptable (Baseline):** Typical AI output. It works and is readable, but isn't really organized for speed or cost.
* **4 - Good:** Clean and broken into logical pieces. Runs fast and efficiently.
* **5 - Excellent:** Super clean. No wasted code. Fast, cheap to run, and organized exactly how it would be done organically.

## Area 2: Functional Completeness (Solves a real problem)
*(Did it actually build what we asked for? Does it address the user's need?)*
* **1 - Unacceptable:** Doesn't even run. Totally missed the point of the problem.
* **2 - Poor:** It runs, but it's missing the main things we asked for.
* **3 - Acceptable (Baseline):** The main stuff works, but secondary features are missing or buggy.
* **4 - Good:** Nailed it. Everything we asked for is there and it actually solves the problem.
* **5 - Excellent:** Hit all the requirements, plus added smart, helpful features that make it even better at solving the problem.

## Area 3: UI/UX & Polish (Easy to use & Good looking)
*(Is the interface intuitive? Is the UI well-designed?)*
* **1 - Unacceptable:** Totally broken layout. Ugly and impossible to use.
* **2 - Poor:** Super clunky. It works, but it's frustrating and looks like an afterthought.
* **3 - Acceptable (Baseline):** Generic AI styling. It's functional but looks plain and boring.
* **4 - Good:** Clean, responsive, and actually looks nice. Easy to navigate.
* **5 - Excellent:** Looks beautiful and intuitive. Feels like a real, finished product you'd actually want to use.

## Area 4: Robustness & Error Handling (Reliable, Secure & Private)
*(Does it work properly and consistently? What happens with unexpected inputs?)*
* **1 - Unacceptable:** Crashes instantly. No security. Doesn't even try to handle bad inputs.
* **2 - Poor:** Super fragile. Step off the "happy path" and it breaks right away.
* **3 - Acceptable (Baseline):** Works fine if you do exactly what you're supposed to (the happy path). But weird inputs cause weird glitches.
* **4 - Good:** Reliable. Doesn't crash when you throw normal edge cases at it. Handles bad inputs securely.
* **5 - Excellent:** Handles unexpected inputs, wrong data types, and malicious use gracefully without dying. Tells the user what went wrong.

## Area 5: AI Artifacts & Drift
*(Did it stay focused, or did it make things up and get lazy?)*
* **1 - Unacceptable:** Made up fake libraries or built something completely different.
* **2 - Poor:** Super lazy. Left a bunch of `// TODO` comments instead of writing code, or added heavy, useless features.
* **3 - Acceptable (Baseline):** Minor drift. Stayed mostly on track but left a few useless stubs or comments.
* **4 - Good:** Focused. No fake libraries, no lazy placeholders. Just the code we needed.
* **5 - Excellent:** No hallucinations or laziness. Built exactly what we asked for.
