# Super Power your git config
_Date: 2023-03-10 18:25:31_

git is the defacto way to manage source code, if you haven't heard of git this blog is not for you.

If you are a *software developer*, *data scientist*, *data engineer*, *dev ops engineer* or frankly in *any role that touches software development*, and you haven't heard of git ... well, where have you been?

git config is the way to manage the default behaviors of git and I'd always recommend setting some basic config above what comes out of the box. Run the following in git console (or cmd line if git is on your env variables PATH):

```
git config --global core.autocrlf false
git config --global fetch.prune true
git config --global push.default true
```

In order, what the above is doing is:

* core.autocrlf false: *or true*, lots of debate on this one (e.g. <https://stackoverflow.com/questions/2825428/why-should-i-use-core-autocrlf-true-in-git>) so just agree a convention in your team and stick with it
  + **or better**: use .gitattributes in your repo so it's not relevant and future developers don't introduce a load of line ending only diffs from their personal preference, see <https://rehansaeed.com/gitattributes-best-practices/#line-endings>).
* fetch.prune true: If the remote branch is deleted, it's deleted from your "remotes/" branches locally, which just makes sense to me.
* push.default current: Don't have to specify the branch you are pushing ("git push -u feature/my-change") , you always push the branch you currently have checked out ("git push").

## git alias's

Alias's are really cool way to type less when doing the basic git operations you do everyday, and also as a way to remember the more complicated ones so you don't have to. For example

* `git co` rather than `git checkout`
* `git c 'my message'` rather than `git commit -m 'my message'`
* `git rom` rather than `git fetch; git rebase origin/master`
* `git track` rather than `branch=$(git rev-parse --abbrev-ref HEAD); git branch --set-upstream-to=origin/${1-$branch} $branch;`

Might not seem a lots but if you are typing these multiple times an hour for the rest of your working life, it adds up!

To add a single alias:

```
git config --global alias.co checkout
```

To add a bunch, it's probably easier to open the actual .gitconfig file: **`git config --global --edit`**. If this opens something unmanagable like a vim editor (see next section), remember the location of the file and open it in notepad or your favorite text editor.

Then add the following, or pick and choose, or add your own!

```
[alias]
	s = status
	co = checkout
	c = commit -m
	a = add .
	ac = "!f(){ git add . && git commit -m \"$1\";};f"
	l = log --oneline -10
	caa = "!f(){ git add . && git commit -a --amend -C HEAD; };f"
	dad = !curl -s https://icanhazdadjoke.com/
	ptag = push origin --tags
	cp = cherry-pick
	cpc = cherry-pick --continue
	rb = rebase
	rbc = rebase --continue
	rom = "!f(){ git fetch; git rebase origin/master;};f"
	spull = "!f(){ git stash; git pull; git stash apply;};f"
	wip = "!f(){ git add .; git commit -m \"WIP\";};f"
	url = remote get-url --all origin
	mt = mergetool
	mc = merge --continue
	track = "!f(){ branch=$(git rev-parse --abbrev-ref HEAD); git branch --set-upstream-to=origin/${1-$branch} $branch; };f" 
```

Now to use your alias you can replace the long version with the short version. For example: `git ac "short description of my change"`, adds all local changes and commits them.

---

## git text editor

Setting additional defaults to use a sensible text editor when user input required is also a game changer. The below is relevant for **vscode**, but there are equivalents for notepad++, atom, or any other sensible text editor; google is your friend.

```
[diff]
	tool = vscode
[difftool "vscode"]
	cmd = code --wait --diff $LOCAL $REMOTE
[merge]
	tool = vscode
[mergetool]
	trustExitCode = false
	keepBackup = false
	keepTemporaries = false
[mergetool "vscode"]
	cmd = code --wait $MERGED
[core]
	editor = code --wait
```

Now if you run something like `git mergetool`, your merge conflicts will open in a new vscode window and you can resolve them there with vscode's support. Or, `git config --global --edit`.

---

## git init

Last but not least, support for git templates is something I use often, for adding some commit hooks whenever you initialize a new git repo or checkout a new one from a remote.

[init]   
 templatedir = ~/.git-templates  
  
Then add a '.git-templates' folder in the same location as the '.gitconfig' file. Then inside that a folder "hooks" and 2 files (no file extension):

post-commit

```
#!/bin/sh

#Print commit hash
git log -1 --format=format:%h
```

pre-push

```
#!/bin/sh

# adds a link to generate an Azure DevOps PR on the command line
# for github change to something like `$url/$branch/compare`
url="$2"
branch=$(git rev-parse --abbrev-ref HEAD | sed 's./.%2F.g')
echo ""
echo "Create PR at: $url/pullrequestcreate?sourceRef=$branch"
echo ""
```

It should look something like:

![](https://andysprague.com/wp-content/uploads/2023/03/image.png?w=855)

This adds a link to generate a PR on the command line. The above is specific to Azure DevOps and will need to be played around with for you git provider. e.g. something like `echo "Create PR at: $url`/`$branch/compare`" might work for github.

---

That's all folks!