## // don't look away

A browser-based horror game where your cursor is your only source of light. You must debug code while managing a threat that advances when you aren't looking at it.

## Why

I wanted to build a game where tension is enforced by mouse movement rather than a generic timer. The core mechanic forces you to choose between progressing the game and keeping yourself safe, as the cursor cannot be in two places at once.

## What it dose

The screen is split into two sections: an editor panel and a reflection window. The only light source is a radial gradient spotlight tied to the mouse coordinates.

You select a programming language (JavaScript, Python, C++, or Java) and are presented with a series of buggy code snippets. You must click the erroneous line, type the exact correction into an inline input field, and hit Enter. Correct answers advance the puzzle queue; incorrect answers trigger a shake animation and force a retry.

While you solve the puzzle, a figure in the reflection window approaches. A ```closeness``` value increments continuously by 0.6 every 100 milliseconds as long as your spotlight is not on the figure. Moving your cursor over the figure drains the ```closeness``` value by 2 per tick. A visible UI bar fills with red, and the figure's opacity and scale increase alongside this value. If ```closeness``` reaches 100, a jumpscare triggers and the night resets.

## Challenges

The primary challenge was time constraints. I originally planned to implement a camping timer that would penalize players for leaving their cursor parked on the mirror indefinitely, as well as a per-night time limit. Because I was completing this just before the deadline, I dropped those features. The game currently relies entirely on the inherent time cost of reading and typing the code fixes to force the player to look away from the mirror.

## Built With

- HTML
- CSS
- Java Script