const { createCanvas, loadImage } = require("canvas");

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
  const width = 1000;
  const height = 1000;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // fill the background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // loop over the layers
  for (const [layerIndex, layer] of config.entries()) {
    const { count, radius, distance, users } = layer;

    const angleSize = 360 / count;

    // loop over each circle of the layer
    for (let i = 0; i < count; i++) {
      // We need an offset or the first circle will always on the same line and it looks weird
      // Try removing this to see what happens
      const offset = layerIndex * 30;

      // i * angleSize is the angle at which our circle goes
      // We need to converting to radiant to work with the cos/sin
      const circleAngle = i * angleSize;
      const r = toRad( circleAngle + offset);

      const circleX = Math.cos(r) * distance + width / 2;
      const circleY = Math.sin(r) * distance + height / 2;

      // Drawing line for each circle from 'Center' position [ width / 2 , height / 2 ] to  [circleX,circleY]
      ctx.beginPath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 12]);
      ctx.moveTo(width / 2, height / 2);
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
      const fontSize = 16;
      ctx.font = `bold ${fontSize}px arial`;
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      let textX , textY;
      let textWidth = Math.max(ctx.measureText(users[i].username).width,ctx.measureText(users[i].name).width);
      if(circleAngle === 90){
        [textX,textY] = [circleX ,circleY + radius + fontSize*2 + 6];
      }
      else if(circleAngle === 270){
        [textX,textY] = [circleX,circleY - radius - fontSize*2];
      }
      else if(circleAngle < 90 || circleAngle > 270){
        [textX,textY] = [circleX + radius + textWidth/2 + fontSize,circleY + fontSize/2];
      }
      else {
        [textX,textY] = [circleX - radius - textWidth/2 - fontSize,circleY + fontSize/2];
      }
      ctx.fillText(users[i].name,textX,textY - 12);
      ctx.fillText(users[i].username,textX,textY + 12);
    }
  }

  return canvas.createPNGStream();
};
