# Python - (Ab)Using Environments
_Date: 2022-12-02 21:56:09_

So I recently picked up a legacy(ish) python application that had a CI/CD pipeline that built from a setup.py file (think: `python setup.py build`). I wanted to create a local dev environment using the only sensible choice (excluding docker) - *conda*. I also wanted to utilize an *environment.yml* file to give new developers a very quick path to creating an exact match of the environment. Finally - I'm lazy\*, and did not want to re-engineer all of the existing CI/CD pipelines to use conda.

I'm not going into much detail here, if you are new to environment.yml files read this first: <https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html>.

I also welcome any feedback or better approaches in the comments, mixing "python environment management" paradigms is playing with fire.

\* *maybe lazy is the wrong word - my choices on how to setup my local dev env should not necessarily impact how it's deployed in production. Put another way - one might not have the capacity or influence to change that decisio*n *in a large organization*.

## setup.py

Option 1 - get me a conda env please!

```
from setuptools import setup, find_packages

config = {
    'description': 'andysprague.com tutorial helper',
    'author': 'Andy Sprague',
    'url': 'andysprague.com',
    'version': '0.0.1',
    'install_requires': [
        'requests==2.7.0',
    ],
    'packages': find_packages(),
    'name': 'myapp'
}

setup(**config)
```

Given the above as a starting point (from my legacy app), how to spin up a local conda env, and persist as an environment.yml file?

```
conda create -n mycondaenv python=3.9 -y
conda activate mycondaenv
python setup.py develop
conda env freeze > environment.yml
```

We have lift-off! Now my new developer Bob can run this to get their env up and running:

```
conda env -f environment.yml -n bobcondaenv
conda activate bobcondaenv
```

The environment.yml file is (after tidy up):

```
# environment.yml
name: myenv
channels:
  - defaults
dependencies:
  - pip=22.2.2
  - python=3.9.15
  - pip:
    - requests==2.7.0
```

Downside? You are now maintaining library versions in **2 places**: the setup.py file, *and* the environment.yml file. Trust me when I say they will *not* remain in sync,

... and that you'll only find out in production!

## requirements.txt

So how can we link *environment.yml*, to pull dependencies from *setup.p*y? We need a **go-between**, which is probably familiar to you my avid python reader ... it's the *requirements.txt* file of course. We can set up a requirement.txt file like this, so it uses the setup.py file for the list of dependencies:

```
# requirements.txt
-e .
```

And the environment.yml file can *reference the requirement.txt file* (neat!):

```
# environment.yml
name: myenv
channels:
  - defaults
dependencies:
  - pip=22.2.2
  - python=3.9.15
  - pip:
    - -r requirements.txt
```

Now our dev env and our production remains in sync, and we can have a quick path to productivity for any new developers.

## Bonus Content

We want to add some unit testing, right? We also want our IDEs to do linting, formatting and autocomplete? What about support for jupyter notebooks for data exploration?

We don't need those in prod though. We have accidentally introduced a separation of concerns above: *environment.yml* for dev, *setup.py* for prod. We can specify dev only resources in our environment.yml file!

```
# environment.yml
name: myenv

channels:
  - defaults

dependencies:
  - pip=22.2.2
  - python=3.9.15

  # Test/Dev
  - autopep8
  - pylint
  - pytest
  - mock

  # Jupyter: run `jupyter notebook`
  - notebook
  - nb_conda_kernels
  - jupyter_contrib_nbextensions
  
  # Actual application dependencies
  - pip:
    - -r requirements.txt
```

Happy coding!