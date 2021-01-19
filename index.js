const express = require('express');
const app = express();
const renderImage = require('./image');

app.get('/', async function(req, res) {
  const images = [
    {
      avatar : "https://pbs.twimg.com/profile_images/1336252326009565186/5lC8aG_s_400x400.jpg",
      username:'@milad_d3',
      name:'Milad dE'
    },
    {
      avatar : "https://pbs.twimg.com/profile_images/1116640992126492675/47ga7kxo_400x400.jpg",
      username:'@Roshanyyy',
      name:'Roshy Is Me'
    },
    {
      avatar : "https://pbs.twimg.com/profile_images/1323753431782273024/7zOG-MDN_400x400.jpg",
      username:'@miladrey',
      name:'Milad Rey'
    },
    {
      avatar : "https://pbs.twimg.com/profile_images/1280131636294795264/ZPKI60-0_400x400.jpg",
      username:'@saeedvaziry',
      name:'Saeed Vaziry'
    },
    {
      avatar : "https://pbs.twimg.com/profile_images/1270604869142011904/cAmLANoD_400x400.jpg",
      username:'@MilaDnu',
      name:'Miladᴺᴼᵁᴿᴵ（ツ）'
    },
    {
      avatar : "https://pbs.twimg.com/profile_images/1114504754896486400/qQoZ2FDu_400x400.jpg",
      username:'@eliafen',
      name:'Elhami'
    },
    {
      avatar : "https://pbs.twimg.com/profile_images/1222206393861713921/EFgpZ3BT_400x400.jpg",
      username:'@Nima1980',
      name:'Nima Ⓝ'
    },
    {
      avatar : "https://pbs.twimg.com/profile_images/974396717511659520/PBcx3FlM_400x400.jpg",
      username:'@MoslemEbrahimi',
      name:'Moslem Ebrahimi'
    },
    {
      avatar : "https://pbs.twimg.com/profile_images/1341458762209652739/V81ViOrN_400x400.jpg",
      username:'@fattahiii',
      name:'Abolfazl Fattahi'
    },
  ];
  let image = await renderImage([
    {
      distance: 280,
      count: 8,
      radius: 60,
      users: images
    },
    {
      distance: 0,
      count: 1,
      radius: 100,
      users: [
        {
          avatar : "https://pbs.twimg.com/profile_images/1222206393861713921/EFgpZ3BT_400x400.jpg",
          username: "Nima1980",
          name: "Nima NourMohammadi"
        }
      ]
    },
  ]);
  image.pipe(res);
});

app.listen(4000, function() {
  console.log(`Listening on port 4000!`);
});