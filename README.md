# Adding submodules

> Note: to avoid sync errors I've temporarily put the repos that are not submodules in `.gitignore`, so if you've decided to add your repo to submodules <span style="color:red">**_remember to remove them from `.gitignore`_**</span>

```bash
cd ml/
git submodule add <remote_url> <repo_name>

git status # (optional): see your repo is untracked or not
git add <repo_name>
git commit -m <commit_message>
git push
```

# Updating repo

```bash
git switch main
git pull
git submodule update --recursive
```

or (WIP: need to wait for all submodules to be added)

```bash
cd ml/scripts/
bash sync_repo.sh
```

# Contributing on same server

To see who's name is it now:

```bash
cd <the_repo_contributing>
git config --local --list
```

Remember to change your name when contributing

```bash
cd <the_repo_contributing>
git config --local user.email <your_email>
git config --local user.name <your_username>
```

example:

```bash
cd LivePortrait/
git config --local user.email andrew1mail@gmail.com
git config --local user.name andrewhsugithub

git config --local user.email h0920185003@gmail.com
git config --local user.name h44343880
```

# How to run each model respectively

Real3DPortrait:

```bash
cd Real3DPortrait/
bash ./start.sh
```

GPT-SoVITS-Inference:

```bash
cd GPT-SoVITS-Inference/
bash ./start.sh
```

LivePortrait:

```bash
cd LivePortrait/
bash ./start.sh
```

GPT-Audio:

```bash
cd GPT-Audio
bash ./start.sh
```

# How to run all

1. add env variables

```bash
cp ./scripts/.env.sh.template ./scripts/.env.sh
```

2.

```bash
bash ./scripts/run_all.sh
```

## TODO

- [ ] think of the schema and add database for MuseTalk (each person can have multiple avatars/emotions)
- [ ] change how we loop the video
- [ ] add default avatar for client to play during preprocessing stage
- [ ] add Read3D-Interface into submodule
- [ ] add videoCutting into submodule
- [ ] turn into web app
- [ ] make realtime
- [ ] use gfpgan to make higher resolution (can this be done in realtime though?)
- [ ] use frame interpolation methods to make video more smooth (for demo purposes, can't do this in realtime)
