# Final Report
## CSE 110 Group 7

### Phase 1 - Setup
We began by setting up the repository. This was lead by Kareem, who created a set of instructions for how to execute each trial. We then agreed on our evaluation rubric, lead by Aarnav and Cindy. This rubric provided a description for what constituted good and bad quality in the following areas:
1. Code Architecture (Is the code organized? Does it run fast and save compute/tokens?)
2. Functional Completeness (Did it actually build what we asked for? Does it address the user's need?)
3. UI/UX & Polish (Is the interface intuitive? Is the UI well-designed?)
4. Robustness & Error Handling (Does it work properly and consistently? What happens with unexpected inputs?)
5. AI Artifacts & Drift (Did it stay focused, or did it make things up and get lazy?)
We selected **Claude Code** running **Haiku 4.5** as our model for its efficiency and because some of our team members had experience using it in the past.

### Phase 2 - First Runs
We split up the 50 runs between the members according to the following list:
- Theo: 1-5
- Bishal: 6-10
- Ethan: 11-15
- Aarnav: 16-20
- Johnny: 21-25
- Benjamin: 26-30
- Cindy: 31-35
- Gabriele: 36-40
- Nhan: 41-45
- Thy: 46-50

Each trial runner entered the quantitative and qualitative data from each trial into a [**shared Google Sheet**](../step1/metrics.csv). We encountered trouble particularly in getting the input and output token counts from Claude Code, so we are not 100% confident in the accuracy of those columns. We also had difficulty in providing consistent evalutations of the app and code quality. Even with the rubric, it was hard to distill a unified understanding of quality. The code review was especially challenging because of how much code was generated (32,773 lines of code in total). There simply wasn't enough time to do a full code review on each trial.

### Phases 3, 4, and 5 - Refinement
After reviewing the data, we as group came to the conclusion that candidates 002, 006, 009, 030, and 031 were the best. These candidates generally had the following properties:
- They ran in the browser and had the basic functionality working
- They had a readable UI with decent color pallete
- They had a nice and clean spin animation that actually emulated the spin of a
real slot machine
- They included buttons to increment or modify the bet amount
- They had a quick and clean reset button
- They had working sound effects

Lead by Johnny and Michael, we then developed refinement prompts, iterated with the prompts, then repeated.

Our first refinement prompt (151 words) resulted in candidate 006 and 031 becoming no longer functional, leaving 002, 009, and 030 as the obvious choices to continue with purely due to their functionality. 

Our next refinement prompt (186 words) resulted in candidate 002 being the only one that failed to meet the expectations set in the prompt. Thus, we selected candidates 009 and 030 to move on to the next stage. Of note, other than the icons, Claude did not alter the slot machines in a notable way. 

For our next refinement prompt (187 words), the difference in quality was less clear-cut. We ultimately chose candidate 009 because its buttons to increment/decrement the bet were functional, and it made changes to make the icons looked better. Candidate 030's increment/decrement bet buttons were still not functional despite the explicit instructions in the prompt to fix them. It also only minimally changed one of the icons.

For our final prompt (189 words), candidate 009 still had animation issues. Though the icons changed and were noticably closer to what the prompt asked for, the icons and spinning animation were not properly synchronized. Otherwise, the slot machine worked as intended.

### Final Thoughts
Throughout the entire process, the AI never generated anything particularly impressive. The UI was consistently mediocre at best, and there always seemed to be at least slight issues with animation. None of the slot machines were particularly fun nor demonstrated good game design. Moreover, the code was only ostensibly of high quality. The AI mostly followed the idea of the prompts, but it was a bit difficult getting it to correctly fix issues with the slot machine. This experiment definitely showed the variance inherent to LLMs and their general inability to produce quality results. 
