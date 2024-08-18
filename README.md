# Adding submodules
```bash
cd ml/
git submodule add <remote_url> <repo_name>

git status # see your repo is untracked or not
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
or 
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