> July 22 2020

### F5
F5 started out as a multiplayer, player-built choose your own online text adventure.

I wrote code to support different hosting different types of text adventures with only the one codebase. For instance, you could create a live config that would define a "one word story" text adventure. This would be deployed along with any other configurations on each deploy.

The one word story almost served like a blog and before I knew it, I was using f5 to serve my blog.

Since then, I've mostly abandoned the text adventure apps (though they still work to my knowledge).

Now the focus is building out this blog. It has very strange patterns. Here are the key features:
* you can define values in the live config which are then bundled with the app at build time
* you can define build-time file overrides by appending your app name to any existing file in the codebase
* you can add whitelisted React components to your markdown in blog posts and they will render correctly

It's been an interesting experiment. I will continue to simply use this as a playground for proofing React components and hosting random tools or widgets I build.

> April 24 2020

### F5

F5 is a massive multiplayer online text adventure.

The multiplayer component is that if you reach the end of the "adventure" by following a certain path you have to wait for someone else to add the next part of the story, but currently that's not enforced. Once someone replies, the adventure continues.

### Play it
https://parm.app/

### Development
```sh
# fetch code and start dev server
git clone https://github.com/prmichaelsen/parm.git
npm i && npm i -g @nrwl/cli
# fill this with the requisite secrets
touch ./env/parm-app.json
nx serve f5
```
You'll need some secrets, reach out to me if you want to run this locally and I can work with you.

Run a specific app for local development:
```sh
nx run f5:serve:parm 
```

For more dev info, see [DEV_README](./DEV_README.md).

## Deployment
To deploy all f5 apps:
```sh
# *requires npm i -g typescript ts-node
./tools/scripts/f5/0-deploy.ts
```

This script:
* pulls the live config for each app from firestore
* bundles the apps
* updates the dist with some assets
* deploys to firebase hosting 

### Data Backup
See `./tools/scripts/f5/backup.ts` for a method to download all firestore data.

### Roadmap
* use OAuth2.0 for reddit auth 🔴9️⃣
* tweak UI to be less frustrating 🟡6️⃣
* left-to-right and top-to-bottom toggles 🟢3️⃣
* set default top-to-bottom via device media query 🟢3️⃣
* set default theme coolor via theme pref media query 🟢3️⃣
* algorithmic selection of available options 🟢6️⃣
* share options 🟢3️⃣
* some notification system for when someone has replied to your option that previously had 0 children 0️⃣
* report 0️⃣
* music sharing app 0️⃣
* animate button slider 0️⃣
* animate new option loading 0️⃣

### Completed Roadmap
The newest features are at the top of this list.
* generalize core code for use in other apps 0️⃣
* theming
* tap to show menu 🟢9️⃣
* track node views
* track num times chosen 🟡6️⃣
* favorites 🟢6️⃣
* perma-link to a node 🟡6️⃣
* go back 🟡3️⃣
* routing for each selection 🔴9️⃣
* markdown support
* cookie to enforce users can't reply to self
* random option selection re-selects on every render
* edit 0️⃣
* youtube embed
* direct image linking for sites like reddit

### Not on roadmap
* replies
* horizontal colored bars with length corresponding to reply nest level on each reply
* control cards, ie filter, map, reduce, sort
  * control cards will be a top level type card that can influence
    presentation of the cards on the page
* could allow configuration to reuse existing databases, for quick aliasing new domain names to re-use parm
* could allow using ace editor for creating cards

### Key
This key is allows me to label roadmap items. Not everything will be assigned labels.

If I provide two keys for one category, it means its somewhere inbetween.

* 🟢🟡🔴 -  urgency, 🔴 being the most urgent
* 0️⃣3️⃣6️⃣9️⃣ -  most important, 9️⃣ being the most imporant, 0️⃣ being optional
* ✨🐞 - feature, bug

### FAQ

#### What if someone tries to make every option "you died"? That's no fun.
No that's fine. It's a build your-own-adventure. I'm not going to make up any rules about how you should play _your_ adventure. Anything can happen in the adventure. So your character died. What happens next?

### Design
#### Option Selection Design
The plan is to eventually intelligently select which options to display based on some criteria
such as
* longest path
* newest
* most travelled

> Open Question: which selection criteria not mentioned here would help enrich the gaming experience?

### Feedback
If you have feedback, create an issue or use the [google forms feedback link](https://docs.google.com/forms/d/e/1FAIpQLScNyQH8qODIN7895f7duAT3_NsQ54NfRiFzMr5yquhh5Aa_6A/viewform?entry.800675036=fuck+fuck+fuck+fuck+fuck).