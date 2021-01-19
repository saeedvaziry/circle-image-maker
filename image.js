const { createCanvas, loadImage , registerFont} = require("canvas");

const toRad = (x) => x * (Math.PI / 180);

/**
 *
 * @param config is an array with 4 entries
 * Each entry is an object with the following properties:
 * distance: from the middle of the image to the middle of the circle at the current layer. The bigger the number, the further is the layer from the center
 * count: circles in the current layer
 * radius: of the circles in this layer
 * users: list of users to render in the format {avatar:string,username:string}
 * @returns {Promise<void>}
 */
module.exports = async function render(config, bg = "#00b4f7") {

  const width = 1200;
  const height = 1000;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const drawingStartPosition = {
    x : width / 2,
    y : (height + 100) / 2,
  };
  // fill the background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // loop over the layers
  for (const [index , layer] of config.entries()) {
    const { count, radius, distance, users } = layer;
    const angleSize = 360 / count;
    // loop over each circle of the layer
    for (let i = 0; i < count; i++) {

      // i * angleSize is the angle at which our circle goes
      // We need to converting to radiant to work with the cos/sin
      const circleAngle = i * angleSize;
      const r = toRad( circleAngle );

      const circleX = Math.cos(r) * distance + drawingStartPosition.x;
      const circleY = Math.sin(r) * distance + drawingStartPosition.y;

      // Drawing line for each circle from 'Drawing Start Position' to  [circleX,circleY]
      ctx.beginPath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4;
      ctx.setLineDash([7, 12]);
      ctx.moveTo(drawingStartPosition.x, drawingStartPosition.y);
      ctx.lineTo(circleX, circleY);
      ctx.stroke();
      ctx.save();

      // if we are trying to render a circle but we ran out of users, just exit the loop. We are done.
      if (!users[i]) break;


      ctx.beginPath();
      ctx.arc(circleX, circleY, radius, 0, 2 * Math.PI);
      ctx.clip();

      const defaultAvatarUrl = "https://abs.twimg.com/sticky/default_profile_images/default_profile_200x200.png";
      const avatarUrl = users[i].avatar || defaultAvatarUrl;

      const img = await loadImage(avatarUrl);
      ctx.drawImage(
        img,
        circleX - radius,
        circleY - radius,
        radius * 2,
        radius * 2
      );
      ctx.restore();

      // we don't need username for main image;
      if(distance === 0) break;

      // if circleAngle < 90 || circleAngle > 270 : Text must be in right
      // if circleAngle > 90 && circleAngle < 270 : Text must be in left
      // if circleAngle === 90 : Text must be in bottom
      // if circleAngle === 270 : Text must be in top
      const fontSize = 20;
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      let textX , textY;

      registerFont('font/normal.ttf',{family: 'yahei', weight: 'normal'});
      ctx.font = `normal ${fontSize-3}px yahei`;
      let usernameWidth = ctx.measureText(users[i].username).width;

      registerFont('font/msyhbd.ttf',{family: 'yahei', weight: 'bold'});
      ctx.font = `bold ${fontSize}px yahei`;
      let nameWidth = ctx.measureText(users[i].name).width;

      let textWidth = Math.max(nameWidth,usernameWidth);
      if(circleAngle === 90){
        [textX,textY] = [circleX, circleY + radius + 45];
      }
      else if(circleAngle === 270){
        [textX,textY] = [circleX, circleY - radius - 25];
      }
      else if(circleAngle < 90 || circleAngle > 270){
        [textX,textY] = [circleX + radius + textWidth/2 + 10, circleY];
      }
      else {
        [textX,textY] = [circleX - radius - textWidth/2 - 10, circleY];
      }
      ctx.fillText(users[i].name,textX,textY - 12);
      registerFont('font/normal.ttf',{family: 'yahei', weight: 'normal'});
      ctx.font = `normal ${fontSize-3}px yahei`;
      ctx.fillText(users[i].username,textX,textY + 12);
    }
    ctx.font = `bold 45px yahei`;
    ctx.textAlign = "center";
    ctx.fillText('MY BEST FRIENDS ON',width/2 - 30 ,100);

    const twitterLogo = await loadImage('twitter.png');
    ctx.drawImage(
      twitterLogo,
      width/2 + ctx.measureText('MY BEST FRIENDS ON').width/2 - 12,
      45,70,70
    );

    ctx.font = `bold 20px yahei`;
    ctx.textAlign = "left";
    ctx.fillText('MrPan.me',30 ,height - 30);
  }

  return canvas.createPNGStream();
};
