# Python environment magic (conda -&gt; requirements.tx -&gt; setup.py)
_Date: 2022-11-17 23:10:10_

I recently was working on a python project with an interesting build/release process based on *both* a requirements.txt file and a setup.py file. The ask was to create an easy way for a developer to work on this project using conda envs. This is where I discovered some magic!

## Option 1: Not a 1-liner

## A better way