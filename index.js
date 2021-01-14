const express = require('express');
const app = express();
const renderImage = require('./image');

app.get('/', async function(req, res) {
  const images = [
    "https://pbs.twimg.com/profile_images/1222206393861713921/EFgpZ3BT_400x400.jpg",
    "https://pbs.twimg.com/profile_images/1336252326009565186/5lC8aG_s_400x400.jpg",
    "https://pbs.twimg.com/profile_images/1313988570336681984/REwIHNAc_400x400.jpg",
    "https://pbs.twimg.com/profile_images/1301255414735147009/AbFi0tIm_400x400.jpg",
    "https://pbs.twimg.com/profile_images/1344221435204665345/C8DnuZqu_400x400.jpg",
    "https://pbs.twimg.com/profile_images/1315375653466800130/Wh6CfC4j_400x400.jpg",
    "https://pbs.twimg.com/profile_images/1253472047298215936/IoEx1UNd_400x400.jpg",
    "https://pbs.twimg.com/profile_images/1334251286292787201/U8OJ_Jcb_400x400.jpg",
    "https://pbs.twimg.com/profile_images/1347869218197315586/jxvJUWBY_400x400.jpg",
  ];
  let image = await renderImage([
    {
      distance: 0,
      count: 1,
      radius: 100,
      users: ["https://pbs.twimg.com/profile_images/1222206393861713921/EFgpZ3BT_400x400.jpg"]
    },
    {
      distance: 300,
      count: 8,
      radius: 50,
      users: images
    }
  ]);
  image.pipe(res);
});

app.listen(3000, function() {
  console.log(`Listening on port 3000!`);
});