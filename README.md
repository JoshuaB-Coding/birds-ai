# birds-ai
Teaching a population of birds to fly in a domain without hitting each other

## Problem Statement

Given a domain of some set size and a population of $N$ birds, can they each learn to fly together without hitting the wall or each other? Further, if a population of $M$ predators is introduced into the system (where $N > M$), can the birds learn to avoid the predator and each other? Will they sacrifice each other to the predator in order to ensure their own survival or will the survival of the population as a whole take priority? The detailed dynamics of this system and each of the scenarios is to explained below. If you have any further ideas of something which would be interesting to test feel free to let me know!

## Birds

Each bird has a neural network which takes the following information as inputs and outputs respectively.
- Inputs
  - Current speed
  - Current direction
  - Distance to top and bottom walls ($Y$ only)
  - Distance to left and right walls ($X$ only)
  - Distance to nearest bird in both $X$ and $Y$
- Outputs
  - Desire to increase speed (between 0 and 1)
  - Desire to decrease speed (between 0 and 1)
  - Desire to keep speed the same (between 0 and 1)
  - Desire to turn left (between 0 and 1)
  - Desire to turn right (between 0 and 1)
  - Desire to keep direction the same (between 0 and 1)
Given these outputs, the bird will take an action depending on which of the three parameters is greatest. For example, consider the first 3 outputs being 0.1, 0.8 and 0.3. As 0.8 is the greatest of these 3 values, the bird will decrease it's speed.

Let the speed of the bird be denoted as $U$ and the direction of the bird be denoted as $\alpha$. Set $\alpha = 0$ to be aligned with the positive $X$ direction and positive $\alpha$ being clockwise such that

$$
\frac{dX}{dt} = U \cos(\alpha), \ \frac{dY}{dt} = U \sin(\alpha)
$$

Note that these equations account for the fact that $Y$ positive points downwards in an html canvas. Also note that this simulation is 2D, so we are not considering the birds being able to change their altitude.

## Predator

The dynamics of the predator are identical to the birds. For fun, the first aim will be to make the predator controllable by the user so that the birds learn to avoid the user, making it more and more difficult for the user to win the game with every iteration.
