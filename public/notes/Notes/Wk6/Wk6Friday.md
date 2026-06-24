**Friday**


# decoupled new event system for the buyables
- problem in question - when choosing locations it will be difficult to probe for the location being used, so I separated the logic to have
grid where the x and y is stored at 9 preset locations in the game area - this works well - I also added "taken" as a boolean that gets reset every room.
- this means when a new room is selected  a series of events fire to reset and choose random weapons and pickups etc.
have the weapons set up for it already