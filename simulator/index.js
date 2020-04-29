﻿var graphs = {
  /**
  * 基本圖型
  **/
  point: function(x, y) {return {type: 1, x: x, y: y, exist: true}},

  line: function(p1, p2) {return {type: 2, p1: p1, p2: p2, exist: true}},

  ray: function(p1, p2) {return {type: 3, p1: p1, p2: p2, exist: true}},

  line_segment: function(p1, p2) {return {type: 4, p1: p1, p2: p2, exist: true}},

  segment: function(p1, p2) {return {type: 4, p1: p1, p2: p2, exist: true}},

  circle: function(c, r) {
    if (typeof r == 'object' && r.type == 1) {
      return {type: 5, c: c, r: this.line_segment(c, r), exist: true}
    } else {
      return {type: 5, c: c, r: r, exist: true}
    }
  },
  /**
  * inner product
  * @method dot
  * @param {graph.point} p1
  * @param {graph.point} p2
  * @return {Number}
  **/
  dot: function(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
  },
  /**
  * outer product
  * @method cross
  * @param {graph.point} p1
  * @param {graph.point} p2
  * @return {Number}
  **/
  cross: function(p1, p2) {
    return p1.x * p2.y - p1.y * p2.x;
  },
  /**
  * Seeking intersection
  * @method intersection
  * @param {graph} obj1
  * @param {graph} obj2
  * @return {graph.point}
  **/
  intersection: function(obj1, obj2) {
    // line & line
    if (obj1.type == 2 && obj2.type == 2) {
      return this.intersection_2line(obj1, obj2);
    }
    // line & circle
    else if (obj1.type == 2 && obj2.type == 5) {
      return this.intersection_line_circle(obj1, obj2);
    }
    // circle & line
    else if (obj1.type == 5 && obj2.type == 2) {
      return this.intersection_line_circle(obj2, obj1);
    }
  },
  /**
  * Two straight intersections
  * @method intersection_2line
  * @param {graph.line} l1
  * @param {graph.line} l2
  * @return {graph.point}
  **/
  intersection_2line: function(l1, l2) {
    var A = l1.p2.x * l1.p1.y - l1.p1.x * l1.p2.y;
    var B = l2.p2.x * l2.p1.y - l2.p1.x * l2.p2.y;
    var xa = l1.p2.x - l1.p1.x;
    var xb = l2.p2.x - l2.p1.x;
    var ya = l1.p2.y - l1.p1.y;
    var yb = l2.p2.y - l2.p1.y;
    return graphs.point((A * xb - B * xa) / (xa * yb - xb * ya), (A * yb - B * ya) / (xa * yb - xb * ya));
  },
  /**
  * The intersection of a line and a circle
  * @method intersection_2line
  * @param {graph.line} l1
  * @param {graph.circle} c2
  * @return {graph.point}
  **/
  intersection_line_circle: function(l1, c1) {
    var xa = l1.p2.x - l1.p1.x;
    var ya = l1.p2.y - l1.p1.y;
    var cx = c1.c.x;
    var cy = c1.c.y;
    var r_sq = (typeof c1.r == 'object') ? ((c1.r.p1.x - c1.r.p2.x) * (c1.r.p1.x - c1.r.p2.x) + (c1.r.p1.y - c1.r.p2.y) * (c1.r.p1.y - c1.r.p2.y)) : (c1.r * c1.r);

    var l = Math.sqrt(xa * xa + ya * ya);
    var ux = xa / l;
    var uy = ya / l;

    var cu = ((cx - l1.p1.x) * ux + (cy - l1.p1.y) * uy);
    var px = l1.p1.x + cu * ux;
    var py = l1.p1.y + cu * uy;


    var d = Math.sqrt(r_sq - (px - cx) * (px - cx) - (py - cy) * (py - cy));

    var ret = [];
    ret[1] = graphs.point(px + ux * d, py + uy * d);
    ret[2] = graphs.point(px - ux * d, py - uy * d);

    return ret;
  },


  intersection_is_on_ray: function(p1, r1) {
    return (p1.x - r1.p1.x) * (r1.p2.x - r1.p1.x) + (p1.y - r1.p1.y) * (r1.p2.y - r1.p1.y) >= 0;
  },


  intersection_is_on_segment: function(p1, s1) {
    return (p1.x - s1.p1.x) * (s1.p2.x - s1.p1.x) + (p1.y - s1.p1.y) * (s1.p2.y - s1.p1.y) >= 0 && (p1.x - s1.p2.x) * (s1.p1.x - s1.p2.x) + (p1.y - s1.p2.y) * (s1.p1.y - s1.p2.y) >= 0;
  },

  /**
  * Line length
  * @method length_segment
  * @param {graph.segment} seg
  * @return {Number}
  **/
  length_segment: function(seg) {
    return Math.sqrt(this.length_segment_squared(seg));
  },
  /**
  * Square length
  * @method length_segment_squared
  * @param {graph.segment} seg
  * @return {Number}
  **/
  length_segment_squared: function(seg) {
    return this.length_squared(seg.p1, seg.p2);
  },
  /**
  * Two point distance
  * @method length
  * @param {graph.point} p1
  * @param {graph.point} p2
  * @return {Number}
  **/
  length: function(p1, p2) {
    return Math.sqrt(this.length_squared(p1, p2));
  },
  /**
  * Two points squared
  * @method length_squared
  * @param {graph.point} p1
  * @param {graph.point} p2
  * @return {Number}
  **/
  length_squared: function(p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return dx * dx + dy * dy;
  },

  /*
  * Basic drawing function
  */
  /**
  * Midpoint of line segment
  * @method midpoint
  * @param {graph.line} l1
  * @return {graph.point}
  **/
  midpoint: function(l1) {
    var nx = (l1.p1.x + l1.p2.x) * 0.5;
    var ny = (l1.p1.y + l1.p2.y) * 0.5;
    return graphs.point(nx, ny);
  },
  /**
  * Vertical line in line segment
  * @method perpendicular_bisector
  * @param {graph.line} l1
  * @return {graph.line}
  **/
  perpendicular_bisector: function(l1) {
    return graphs.line(
        graphs.point(
          (-l1.p1.y + l1.p2.y + l1.p1.x + l1.p2.x) * 0.5,
          (l1.p1.x - l1.p2.x + l1.p1.y + l1.p2.y) * 0.5
        ),
        graphs.point(
          (l1.p1.y - l1.p2.y + l1.p1.x + l1.p2.x) * 0.5,
          (-l1.p1.x + l1.p2.x + l1.p1.y + l1.p2.y) * 0.5
        )
      );
  },
  /**
  * Draw a line that passes through a point and is parallel to the straight line
  * @method parallel
  * @param {graph.line} l1
  * @param {graph.point} p1
  * @return {graph.line}
  **/
  parallel: function(l1, p1) {
    var dx = l1.p2.x - l1.p1.x;
    var dy = l1.p2.y - l1.p1.y;
    return graphs.line(p1, graphs.point(p1.x + dx, p1.y + dy));
  }
};

var canvasPainter = {
  draw: function(graph, color) {
    //var ctx = canvas.getContext('2d');
    // point
    if (graph.type == 1) {
      ctx.fillStyle = color ? color : 'red';
      ctx.fillRect(graph.x - 2, graph.y - 2, 5, 5); //Draw a filled rectangle
      /*
        ctx.beginPath();
        ctx.arc(graph.x,graph.y,2,0,Math.PI*2,false);
        ctx.fill();
      */
    }
    // line
    else if (graph.type == 2) {
      ctx.strokeStyle = color ? color : 'black';
      ctx.beginPath();
      var ang1 = Math.atan2((graph.p2.x - graph.p1.x), (graph.p2.y - graph.p1.y)); //從斜率取得角度
      var cvsLimit = (Math.abs(graph.p1.x + origin.x) + Math.abs(graph.p1.y + origin.y) + canvas.height + canvas.width) / Math.min(1, scale);  //取一個會超出繪圖區的距離(當做直線端點)
      ctx.moveTo(graph.p1.x - Math.sin(ang1) * cvsLimit, graph.p1.y - Math.cos(ang1) * cvsLimit);
      ctx.lineTo(graph.p1.x + Math.sin(ang1) * cvsLimit, graph.p1.y + Math.cos(ang1) * cvsLimit);
      ctx.stroke();
    }
    // ray
    else if (graph.type == 3) {
      ctx.strokeStyle = color ? color : 'black';
      var ang1, cvsLimit;
      if (Math.abs(graph.p2.x - graph.p1.x) > 1e-5 || Math.abs(graph.p2.y - graph.p1.y) > 1e-5)
      {
        ctx.beginPath();
        ang1 = Math.atan2((graph.p2.x - graph.p1.x), (graph.p2.y - graph.p1.y)); //從斜率取得角度
        cvsLimit = (Math.abs(graph.p1.x + origin.x) + Math.abs(graph.p1.y + origin.y) + canvas.height + canvas.width) / Math.min(1, scale);  //取一個會超出繪圖區的距離(當做直線端點)
        ctx.moveTo(graph.p1.x, graph.p1.y);
        ctx.lineTo(graph.p1.x + Math.sin(ang1) * cvsLimit, graph.p1.y + Math.cos(ang1) * cvsLimit);
        ctx.stroke();
      }
    }
    // (line_)segment
    else if (graph.type == 4) {
      ctx.strokeStyle = color ? color : 'black';
      ctx.beginPath();
      ctx.moveTo(graph.p1.x, graph.p1.y);
      ctx.lineTo(graph.p2.x, graph.p2.y);
      ctx.stroke();
    }
    // circle
    else if (graph.type == 5) {
      ctx.strokeStyle = color ? color : 'black';
      ctx.beginPath();
      if (typeof graph.r == 'object') {
        var dx = graph.r.p1.x - graph.r.p2.x;
        var dy = graph.r.p1.y - graph.r.p2.y;
        ctx.arc(graph.c.x, graph.c.y, Math.sqrt(dx * dx + dy * dy), 0, Math.PI * 2, false);
      } else {
        ctx.arc(graph.c.x, graph.c.y, graph.r, 0, Math.PI * 2, false);
      }
      ctx.stroke();
    }
  },
  cls: function() {
    //var ctx = canvas.getContext('2d');
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale,0,0,scale,origin.x, origin.y);
  }
};

  var objTypes = {};

  //Prototype of line object
  objTypes['lineobj'] = {
  //==============================Create object process mouse press=======================================
  c_mousedown: function(obj, mouse)
  {
    obj.p2 = mouse;
    if (!mouseOnPoint_construct(mouse, obj.p1))
    {
      draw();
    }
  },
  //==============================Create object process mouse movement=======================================
  c_mousemove: function(obj, mouse, ctrl, shift)
  {
    //var basePoint=ctrl?graphs.midpoint(obj):obj.p1;

    //if(!obj.p2

    if (shift)
    {
      //var sq3=Math.sqrt(3);
      //obj.p2=snapToDirection(mouse,constructionPoint,[{x:1,y:0},{x:0,y:1},{x:1,y:1},{x:1,y:-1},{x:1,y:sq3},{x:1,y:-sq3},{x:sq3,y:1},{x:sq3,y:-1}]);
      obj.p2 = snapToDirection(mouse, constructionPoint, [{x: 1, y: 0},{x: 0, y: 1},{x: 1, y: 1},{x: 1, y: -1}]);
    }
    else
    {
      obj.p2 = mouse;
    }

    obj.p1 = ctrl ? graphs.point(2 * constructionPoint.x - obj.p2.x, 2 * constructionPoint.y - obj.p2.y) : constructionPoint;

    if (!mouseOnPoint_construct(mouse, obj.p1))
    {
      draw();
    }

  },
  //==============================Open the object process and release the mouse=======================================
  c_mouseup: function(obj, mouse)
  {
    if (!mouseOnPoint_construct(mouse, obj.p1))
    {
      isConstructing = false;
    }
  },

  //=================================Pan object====================================
  move: function(obj, diffX, diffY) {
    //移動線段的第一點
    obj.p1.x = obj.p1.x + diffX;
    obj.p1.y = obj.p1.y + diffY;
    //移動線段的第二點
    obj.p2.x = obj.p2.x + diffX;
    obj.p2.y = obj.p2.y + diffY;
  },


  //==========================When the drawing area is pressed (the part where the object is pressed)===========================
  clicked: function(obj, mouse_nogrid, mouse, draggingPart) {
    if (mouseOnPoint(mouse_nogrid, obj.p1) && graphs.length_squared(mouse_nogrid, obj.p1) <= graphs.length_squared(mouse_nogrid, obj.p2))
    {
      draggingPart.part = 1;
      draggingPart.targetPoint = graphs.point(obj.p1.x, obj.p1.y);
      return true;
    }
    if (mouseOnPoint(mouse_nogrid, obj.p2))
    {
      draggingPart.part = 2;
      draggingPart.targetPoint = graphs.point(obj.p2.x, obj.p2.y);
      return true;
    }
    if (mouseOnSegment(mouse_nogrid, obj))
    {
      draggingPart.part = 0;
      draggingPart.mouse0 = mouse; //The position of the mouse when you start dragging
      draggingPart.mouse1 = mouse; //The position of the mouse on the previous point when dragging
      draggingPart.snapData = {};
      return true;
    }
    return false;
  },

  //=================================When dragging objects====================================
  dragging: function(obj, mouse, draggingPart, ctrl, shift) {
    var basePoint;
    if (draggingPart.part == 1)
    {
      //Dragging the first endpoint
      basePoint = ctrl ? graphs.midpoint(draggingPart.originalObj) : draggingPart.originalObj.p2;

      obj.p1 = shift ? snapToDirection(mouse, basePoint, [{x: 1, y: 0},{x: 0, y: 1},{x: 1, y: 1},{x: 1, y: -1},{x: (draggingPart.originalObj.p2.x - draggingPart.originalObj.p1.x), y: (draggingPart.originalObj.p2.y - draggingPart.originalObj.p1.y)}]) : mouse;
      obj.p2 = ctrl ? graphs.point(2 * basePoint.x - obj.p1.x, 2 * basePoint.y - obj.p1.y) : basePoint;

      //obj.p1=mouse;
    }
    if (draggingPart.part == 2)
    {
      //Dragging the second endpoint

      basePoint = ctrl ? graphs.midpoint(draggingPart.originalObj) : draggingPart.originalObj.p1;

      obj.p2 = shift ? snapToDirection(mouse, basePoint, [{x: 1, y: 0},{x: 0, y: 1},{x: 1, y: 1},{x: 1, y: -1},{x: (draggingPart.originalObj.p2.x - draggingPart.originalObj.p1.x), y: (draggingPart.originalObj.p2.y - draggingPart.originalObj.p1.y)}]) : mouse;
      obj.p1 = ctrl ? graphs.point(2 * basePoint.x - obj.p2.x, 2 * basePoint.y - obj.p2.y) : basePoint;

      //obj.p2=mouse;
    }
    if (draggingPart.part == 0)
    {
      //Towing the entire line

      if (shift)
      {
        var mouse_snapped = snapToDirection(mouse, draggingPart.mouse0, [{x: 1, y: 0},{x: 0, y: 1},{x: (draggingPart.originalObj.p2.x - draggingPart.originalObj.p1.x), y: (draggingPart.originalObj.p2.y - draggingPart.originalObj.p1.y)},{x: (draggingPart.originalObj.p2.y - draggingPart.originalObj.p1.y), y: -(draggingPart.originalObj.p2.x - draggingPart.originalObj.p1.x)}], draggingPart.snapData);
      }
      else
      {
        var mouse_snapped = mouse;
        draggingPart.snapData = {}; //Release the original drag direction lock when releasing shift
      }

      var mouseDiffX = draggingPart.mouse1.x - mouse_snapped.x; //The current X position of the mouse position and the position of the last mouse position
      var mouseDiffY = draggingPart.mouse1.y - mouse_snapped.y; //The current Y position of the mouse position and the position of the last mouse position
      //Move the first point of the line segment
      obj.p1.x = obj.p1.x - mouseDiffX;
      obj.p1.y = obj.p1.y - mouseDiffY;
      //Move the second point of the line segment
      obj.p2.x = obj.p2.x - mouseDiffX;
      obj.p2.y = obj.p2.y - mouseDiffY;
      //Update mouse position
      draggingPart.mouse1 = mouse_snapped;
    }
  },

  //====================Determine if a light will hit the object (if it is, then pass back the intersection)====================
  rayIntersection: function(obj, ray) {
    var rp_temp = graphs.intersection_2line(graphs.line(ray.p1, ray.p2), graphs.line(obj.p1, obj.p2));   //The intersection of the light (extension line) and the object (extension line)

    if (graphs.intersection_is_on_segment(rp_temp, obj) && graphs.intersection_is_on_ray(rp_temp, ray))
    {
      //If rp_temp is on ray and rp_temp is on obj (ie ray really hits obj, not the extended line of ray hits or hits the extension line of obj)
      return rp_temp; //Return the intersection of the head of the light and the mirror
    }
  }


  };

  //&quot;halfplane&quot; (half plane refractor) object
  objTypes['halfplane'] = {

  p_name: 'Refractive index', //Attribute name
  p_min: 1,
  p_max: 3,
  p_step: 0.01,

  supportSurfaceMerging: true, //Support interface fusion

  //======================================Create object=========================================
  create: function(mouse) {
    return {type: 'halfplane', p1: mouse, p2: mouse, p: 1.5};
  },

  //Using the lineobj prototype
  c_mousedown: objTypes['lineobj'].c_mousedown,
  c_mousemove: objTypes['lineobj'].c_mousemove,
  c_mouseup: objTypes['lineobj'].c_mouseup,
  move: objTypes['lineobj'].move,

  //==========================When the drawing area is pressed (the part where the object is pressed)===========================
  clicked: function(obj, mouse_nogrid, mouse, draggingPart) {
    if (mouseOnPoint(mouse_nogrid, obj.p1) && graphs.length_squared(mouse_nogrid, obj.p1) <= graphs.length_squared(mouse_nogrid, obj.p2))
    {
      draggingPart.part = 1;
      draggingPart.targetPoint = graphs.point(obj.p1.x, obj.p1.y);
      return true;
    }
    if (mouseOnPoint(mouse_nogrid, obj.p2))
    {
      draggingPart.part = 2;
      draggingPart.targetPoint = graphs.point(obj.p2.x, obj.p2.y);
      return true;
    }
    if (mouseOnLine(mouse_nogrid, obj))
    {
      draggingPart.part = 0;
      draggingPart.mouse0 = mouse; //The position of the mouse when you start dragging
      draggingPart.mouse1 = mouse; //The position of the mouse on the previous point when dragging
      draggingPart.snapData = {};
      return true;
    }
    return false;
  },

  //=================================When dragging objects====================================
  dragging: function(obj, mouse, draggingPart, ctrl, shift) {
    var basePoint;
    if (draggingPart.part == 1)
    {
      //Dragging the first endpoint
      basePoint = ctrl ? graphs.midpoint(draggingPart.originalObj) : draggingPart.originalObj.p2;

      obj.p1 = shift ? snapToDirection(mouse, basePoint, [{x: 1, y: 0},{x: 0, y: 1},{x: 1, y: 1},{x: 1, y: -1},{x: (draggingPart.originalObj.p2.x - draggingPart.originalObj.p1.x), y: (draggingPart.originalObj.p2.y - draggingPart.originalObj.p1.y)}]) : mouse;
      obj.p2 = ctrl ? graphs.point(2 * basePoint.x - obj.p2.x, 2 * basePoint.y - obj.p2.y) : basePoint;

      //obj.p1=mouse;
    }
    if (draggingPart.part == 2)
    {
      //Dragging the second endpoint

      basePoint = ctrl ? graphs.midpoint(draggingPart.originalObj) : draggingPart.originalObj.p1;

      obj.p2 = shift ? snapToDirection(mouse, basePoint, [{x: 1, y: 0},{x: 0, y: 1},{x: 1, y: 1},{x: 1, y: -1},{x: (draggingPart.originalObj.p2.x - draggingPart.originalObj.p1.x), y: (draggingPart.originalObj.p2.y - draggingPart.originalObj.p1.y)}]) : mouse;
      obj.p1 = ctrl ? graphs.point(2 * basePoint.x - obj.p2.x, 2 * basePoint.y - obj.p2.y) : basePoint;

      //obj.p2=mouse;
    }
    if (draggingPart.part == 0)
    {
      //Towing the entire line

      if (shift)
      {
        var mouse_snapped = snapToDirection(mouse, draggingPart.mouse0, [{x: (draggingPart.originalObj.p2.x - draggingPart.originalObj.p1.x), y: (draggingPart.originalObj.p2.y - draggingPart.originalObj.p1.y)},{x: (draggingPart.originalObj.p2.y - draggingPart.originalObj.p1.y), y: -(draggingPart.originalObj.p2.x - draggingPart.originalObj.p1.x)}], draggingPart.snapData);
      }
      else
      {
        var mouse_snapped = mouse;
        draggingPart.snapData = {}; //Release the original drag direction lock when releasing shift
      }

      var mouseDiffX = draggingPart.mouse1.x - mouse_snapped.x; //The current X position of the mouse position and the position of the last mouse position
      var mouseDiffY = draggingPart.mouse1.y - mouse_snapped.y; //The current Y position of the mouse position and the position of the last mouse position
      //Move the first point of the line segment
      obj.p1.x = obj.p1.x - mouseDiffX;
      obj.p1.y = obj.p1.y - mouseDiffY;
      //Move the second point of the line segment
      obj.p2.x = obj.p2.x - mouseDiffX;
      obj.p2.y = obj.p2.y - mouseDiffY;
      //Update mouse position
      draggingPart.mouse1 = mouse_snapped;
    }
  },

  //==================== Determine if a light will hit this object (if it is, then pass back the intersection point) ====================
  rayIntersection: function(obj, ray) {
    if (obj.p <= 0)return;
    var rp_temp = graphs.intersection_2line(graphs.line(ray.p1, ray.p2), graphs.line(obj.p1, obj.p2));   //The intersection of the light (extension line) and the object

    if (graphs.intersection_is_on_ray(rp_temp, ray))
    {
      //If rp_temp is on ray (ie ray really hits obj, not the extension of ray)
      return rp_temp; //Return the intersection of the head of the light and the mirror
    }
  },


  //=================================Draw objects onto the Canvas====================================
  draw: function(obj, canvas, aboveLight) {

  if (!aboveLight)
  {
    var len = Math.sqrt((obj.p2.x - obj.p1.x) * (obj.p2.x - obj.p1.x) + (obj.p2.y - obj.p1.y) * (obj.p2.y - obj.p1.y));
    var par_x = (obj.p2.x - obj.p1.x) / len;
    var par_y = (obj.p2.y - obj.p1.y) / len;
    var per_x = par_y;
    var per_y = -par_x;

    var sufficientlyLargeDistance = (Math.abs(obj.p1.x + origin.x) + Math.abs(obj.p1.y + origin.y) + canvas.height + canvas.width) / Math.min(1, scale);

    ctx.beginPath();
    ctx.moveTo(obj.p1.x - par_x * sufficientlyLargeDistance, obj.p1.y - par_y * sufficientlyLargeDistance);
    ctx.lineTo(obj.p1.x + par_x * sufficientlyLargeDistance, obj.p1.y + par_y * sufficientlyLargeDistance);
    ctx.lineTo(obj.p1.x + (par_x - per_x) * sufficientlyLargeDistance, obj.p1.y + (par_y - per_y) * sufficientlyLargeDistance);
    ctx.lineTo(obj.p1.x - (par_x + per_x) * sufficientlyLargeDistance, obj.p1.y - (par_y + per_y) * sufficientlyLargeDistance);

    objTypes['refractor'].fillGlass(obj.p);
  }

  ctx.fillStyle = 'indigo';
  ctx.fillRect(obj.p1.x - 2, obj.p1.y - 2, 3, 3);
  ctx.fillRect(obj.p2.x - 2, obj.p2.y - 2, 3, 3);


  },

  //=============================When the object is shot by light================================
  shot: function(obj, ray, rayIndex, rp, surfaceMerging_objs) {
    //ray.exist=false;

    var rdots = (ray.p2.x - ray.p1.x) * (obj.p2.x - obj.p1.x) + (ray.p2.y - ray.p1.y) * (obj.p2.y - obj.p1.y); //Ray and the inner product of this line segment
    var ssq = (obj.p2.x - obj.p1.x) * (obj.p2.x - obj.p1.x) + (obj.p2.y - obj.p1.y) * (obj.p2.y - obj.p1.y); //The length of this line segment is squared
    var normal = {x: rdots * (obj.p2.x - obj.p1.x) - ssq * (ray.p2.x - ray.p1.x), y: rdots * (obj.p2.y - obj.p1.y) - ssq * (ray.p2.y - ray.p1.y)};
    //normal.x=rdots*(obj.p2.x-obj.p1.x)-ssq*(ray.p2.x-ray.p1.x);
    //normal.y=rdots*(obj.p2.y-obj.p1.y)-ssq*(ray.p2.y-ray.p1.y);

    var shotType = this.getShotType(obj, ray);
    if (shotType == 1)
    {
      //Shooting from the inside to the outside
      var n1 = obj.p; //The refractive index of the source medium (the destination medium is assumed to be 1)
      //canvasPainter.draw(graphs.segment(ray.p1,s_point),canvas,"red");
    }
    else if (shotType == -1)
    {
      //Shooting from the outside to the inside
      var n1 = 1 / obj.p;
    }
    else
    {
      //Conditions that may cause a bug (such as hitting a boundary point)
      //To prevent misunderstanding caused by light in the wrong direction, absorb light
      ray.exist = false;
      return;
    }

    //Interface fusion
    //if(surfaceMerging_obj)
    for (var i = 0; i < surfaceMerging_objs.length; i++)
    {
      shotType = objTypes[surfaceMerging_objs[i].type].getShotType(surfaceMerging_objs[i], ray);
      if (shotType == 1)
      {
        //Shooting from the inside to the outside
        n1 *= surfaceMerging_objs[i].p;
      }
      else if (shotType == -1)
      {
        //Shooting from the outside to the inside
        n1 /= surfaceMerging_objs[i].p;
      }
      else if (shotType == 0)
      {
        //Equivalent to not shooting (for example, two interfaces coincide)
        //n1=n1;
      }
      else
      {
        //Conditions that may cause a bug (such as hitting a boundary point)
        //To prevent misunderstanding caused by light in the wrong direction, absorb light
        ray.exist = false;
        return;
      }
    }
    objTypes['refractor'].refract(ray, rayIndex, rp, normal, n1);


  },

  getShotType: function(obj, ray) {
    var rcrosss = (ray.p2.x - ray.p1.x) * (obj.p2.y - obj.p1.y) - (ray.p2.y - ray.p1.y) * (obj.p2.x - obj.p1.x);
    if (rcrosss > 0)
    {
      return 1; //From the inside out
    }
    if (rcrosss < 0)
    {
      return -1; //From the outside to the inside
    }
    return 2;
  }

  };

  //"circlelens"Property
  objTypes['circlelens'] = {

  p_name: 'Refractive index', //Attribute name
  p_min: 1,
  p_max: 3,
  p_step: 0.01,

  supportSurfaceMerging: true, //Support interface fusion

  //======================================Create object=========================================
  create: function(mouse) {
    return {type: 'circlelens', p1: mouse, p2: mouse, p: 1.5};
  },

  //Using the lineobj prototype
  c_mousedown: objTypes['lineobj'].c_mousedown,
  c_mousemove: function(obj, mouse, ctrl, shift) {objTypes['lineobj'].c_mousemove(obj, mouse, false, shift)},
  c_mouseup: objTypes['lineobj'].c_mouseup,
  move: objTypes['lineobj'].move,

  //==========================When the drawing area is pressed (the part where the object is pressed)===========================
  clicked: function(obj, mouse_nogrid, mouse, draggingPart) {
    if (mouseOnPoint(mouse_nogrid, obj.p1) && graphs.length_squared(mouse_nogrid, obj.p1) <= graphs.length_squared(mouse_nogrid, obj.p2))
    {
      draggingPart.part = 1;
      draggingPart.targetPoint = graphs.point(obj.p1.x, obj.p1.y);
      return true;
    }
    if (mouseOnPoint(mouse_nogrid, obj.p2))
    {
      draggingPart.part = 2;
      draggingPart.targetPoint = graphs.point(obj.p2.x, obj.p2.y);
      return true;
    }
    if (Math.abs(graphs.length(obj.p1, mouse_nogrid) - graphs.length_segment(obj)) < clickExtent_line)
    {
      draggingPart.part = 0;
      draggingPart.mouse0 = mouse; //The position of the mouse when you start dragging
      draggingPart.mouse1 = mouse; //The position of the mouse on the previous point when dragging
      draggingPart.snapData = {};
      return true;
    }
    return false;
  },

  //=================================When dragging objects====================================
  dragging: function(obj, mouse, draggingPart, ctrl, shift) {objTypes['lineobj'].dragging(obj, mouse, draggingPart, false, shift)},

  //====================Determine if a light will hit the object (if it is, then pass back the intersection)====================
  rayIntersection: function(obj, ray) {
    if (obj.p <= 0)return;
    var rp_temp = graphs.intersection_line_circle(graphs.line(ray.p1, ray.p2), graphs.circle(obj.p1, obj.p2));   //The intersection of the light (extension line) and the mirror
    var rp_exist = [];
    var rp_lensq = [];
    for (var i = 1; i <= 2; i++)
    {

      rp_exist[i] = graphs.intersection_is_on_ray(rp_temp[i], ray) && graphs.length_squared(rp_temp[i], ray.p1) > minShotLength_squared;


      rp_lensq[i] = graphs.length_squared(ray.p1, rp_temp[i]); //The distance the light hits the i-th intersection
    }


    if (rp_exist[1] && ((!rp_exist[2]) || rp_lensq[1] < rp_lensq[2])) {return rp_temp[1];}
    if (rp_exist[2] && ((!rp_exist[1]) || rp_lensq[2] < rp_lensq[1])) {return rp_temp[2];}
  },


  //=================================Draw objects onto the Canvas====================================
  draw: function(obj, canvas, aboveLight) {

  if (!aboveLight)
  {
    ctx.beginPath();
    ctx.arc(obj.p1.x, obj.p1.y, graphs.length_segment(obj), 0, Math.PI * 2, false);
    objTypes['refractor'].fillGlass(obj.p);
  }
  ctx.lineWidth = 1;
  //ctx.fillStyle="indigo";
  ctx.fillStyle = 'red';
  ctx.fillRect(obj.p1.x - 2, obj.p1.y - 2, 3, 3);
  //ctx.fillStyle="rgb(255,0,255)";
  ctx.fillStyle = 'indigo';
  //ctx.fillStyle="Purple";
  ctx.fillRect(obj.p2.x - 2, obj.p2.y - 2, 3, 3);


  },

  //=============================When the object is shot by light================================
  shot: function(obj, ray, rayIndex, rp, surfaceMerging_objs) {

    var midpoint = graphs.midpoint(graphs.line_segment(ray.p1, rp));
    var d = graphs.length_squared(obj.p1, obj.p2) - graphs.length_squared(obj.p1, midpoint);
    if (d > 0)
    {
      //Shooting from the inside to the outside
      var n1 = obj.p; //The refractive index of the source medium (the destination medium is assumed to be 1)
      //var normal={x:rp.x-obj.p1.x,y:rp.y-obj.p1.y};
      var normal = {x: obj.p1.x - rp.x, y: obj.p1.y - rp.y};
    }
    else if (d < 0)
    {
      //Shooting from the outside to the inside
      var n1 = 1 / obj.p;
      var normal = {x: rp.x - obj.p1.x, y: rp.y - obj.p1.y};
      //var normal={x:obj.p1.x-rp.x,y:obj.p1.y-rp.y};
    }
    else
    {
      //Conditions that may cause a bug (such as hitting a boundary point)
      //To prevent misunderstanding caused by light in the wrong direction, absorb light
      ray.exist = false;
      return;
    }
    //console.log(n1);

    var shotType;

    //Interface fusion
    //if(surfaceMerging_obj)
    for (var i = 0; i < surfaceMerging_objs.length; i++)
    {
      shotType = objTypes[surfaceMerging_objs[i].type].getShotType(surfaceMerging_objs[i], ray);
      if (shotType == 1)
      {
        //Shooting from the inside to the outside
        n1 *= surfaceMerging_objs[i].p;
      }
      else if (shotType == -1)
      {
        //Shooting from the outside to the inside
        n1 /= surfaceMerging_objs[i].p;
      }
      else if (shotType == 0)
      {
        //Equivalent to not shooting (for example, two interfaces coincide)
        //n1=n1;
      }
      else
      {
        //Conditions that may cause a bug (such as hitting a boundary point)
        //To prevent misunderstanding caused by light in the wrong direction, absorb light
        ray.exist = false;
        return;
      }
    }
    objTypes['refractor'].refract(ray, rayIndex, rp, normal, n1);


  },

  getShotType: function(obj, ray) {

    var midpoint = graphs.midpoint(graphs.line_segment(ray.p1, this.rayIntersection(obj, ray)));
    var d = graphs.length_squared(obj.p1, obj.p2) - graphs.length_squared(obj.p1, midpoint);

    if (d > 0)
    {
      return 1; //From the inside out
    }
    if (d < 0)
    {
      return -1; //From the outside to the inside
    }
    return 2;
  }

  };

  //"refractor&quot;Property
  objTypes['refractor'] = {


  p_name: 'Refractive index', //Attribute name
  p_min: 1,
  p_max: 3,
  p_step: 0.01,

  supportSurfaceMerging: true, //Support interface fusion
  //======================================Create object=========================================
  create: function(mouse) {
    return {type: 'refractor', path: [{x: mouse.x, y: mouse.y, arc: false}], notDone: true, p: 1.5};
  },

  //==============================Create object process mouse press=======================================
  c_mousedown: function(obj, mouse)
  {
    if (obj.path.length > 1)
    {
      if (obj.path.length > 3 && mouseOnPoint(mouse, obj.path[0]))
      {
        //The mouse pressed the first point
        obj.path.length--;
        obj.notDone = false;
        draw();
        return;
      }
      obj.path[obj.path.length - 1] = {x: mouse.x, y: mouse.y}; //Move the last point
      obj.path[obj.path.length - 1].arc = true;
    }
  },
  //==============================Create object process mouse movement=======================================
  c_mousemove: function(obj, mouse, ctrl, shift)
  {
    if (!obj.notDone) {return;}
    if (typeof obj.path[obj.path.length - 1].arc != 'undefined')
    {
      if (obj.path[obj.path.length - 1].arc && Math.sqrt(Math.pow(obj.path[obj.path.length - 1].x - mouse.x, 2) + Math.pow(obj.path[obj.path.length - 1].y - mouse.y, 2)) >= 5)
      {
        obj.path[obj.path.length] = mouse;
        draw();
      }
    }
    else
    {
      obj.path[obj.path.length - 1] = {x: mouse.x, y: mouse.y}; //Move the last point
      draw();
    }
  },
  //==============================Open the object process and release the mouse=======================================
  c_mouseup: function(obj, mouse)
  {
    if (!obj.notDone) {
      isConstructing = false;
      draw();
      return;
    }
    if (obj.path.length > 3 && mouseOnPoint(mouse, obj.path[0]))
    {
      //The mouse is released at the first point
      obj.path.length--;
      obj.notDone = false;
      isConstructing = false;
      draw();
      return;
    }
    if (obj.path[obj.path.length - 2] && !obj.path[obj.path.length - 2].arc && mouseOnPoint_construct(mouse, obj.path[obj.path.length - 2]))
    {
      delete obj.path[obj.path.length - 1].arc;
    }
    else
    {
      obj.path[obj.path.length - 1] = {x: mouse.x, y: mouse.y}; //Move the last point
      obj.path[obj.path.length - 1].arc = false;
      obj.path[obj.path.length] = {x: mouse.x, y: mouse.y}; //Build a new point

    }
    draw();
  },
  //=================================Draw objects onto the Canvas====================================
  draw: function(obj, canvas, aboveLight) {

    //var ctx = canvas.getContext('2d');
    var p1;
    var p2;
    var p3;
    var center;
    var r;
    var a1;
    var a2;
    var a3;
    var acw;

    if (obj.notDone)
    {
      //The user has not finished drawing the object

      ctx.beginPath();
      ctx.moveTo(obj.path[0].x, obj.path[0].y);

      for (var i = 0; i < obj.path.length - 1; i++)
      {
        //ii=i%(obj.path.length);
        if (obj.path[(i + 1)].arc && !obj.path[i].arc && i < obj.path.length - 2)
        {
          p1 = graphs.point(obj.path[i].x, obj.path[i].y);
          p2 = graphs.point(obj.path[(i + 2)].x, obj.path[(i + 2)].y);
          p3 = graphs.point(obj.path[(i + 1)].x, obj.path[(i + 1)].y);
          center = graphs.intersection_2line(graphs.perpendicular_bisector(graphs.line(p1, p3)), graphs.perpendicular_bisector(graphs.line(p2, p3)));
          if (isFinite(center.x) && isFinite(center.y))
          {
            r = graphs.length(center, p3);
            a1 = Math.atan2(p1.y - center.y, p1.x - center.x);
            a2 = Math.atan2(p2.y - center.y, p2.x - center.x);
            a3 = Math.atan2(p3.y - center.y, p3.x - center.x);
            acw = (a2 < a3 && a3 < a1) || (a1 < a2 && a2 < a3) || (a3 < a1 && a1 < a2); //p1->p3-&gt;p2 rotation direction, counterclockwise is true

            ctx.arc(center.x, center.y, r, a1, a2, acw);
          }
          else
          {
            //Arc three points collinear, treated as line segments
            //arcInvalid=true;
            ctx.lineTo(obj.path[(i + 2)].x, obj.path[(i + 2)].y);
          }


        }
        else if (!obj.path[(i + 1)].arc && !obj.path[i].arc)
        {
          ctx.lineTo(obj.path[(i + 1)].x, obj.path[(i + 1)].y);
        }
      }
      //if(!arcInvalid)
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgb(128,128,128)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    else if (!aboveLight)
    {
      //The object has been drawn
      ctx.beginPath();
      ctx.moveTo(obj.path[0].x, obj.path[0].y);

      for (var i = 0; i < obj.path.length; i++)
      {
        //ii=i%(obj.path.length);
        if (obj.path[(i + 1) % obj.path.length].arc && !obj.path[i % obj.path.length].arc)
        {
          p1 = graphs.point(obj.path[i % obj.path.length].x, obj.path[i % obj.path.length].y);
          p2 = graphs.point(obj.path[(i + 2) % obj.path.length].x, obj.path[(i + 2) % obj.path.length].y);
          p3 = graphs.point(obj.path[(i + 1) % obj.path.length].x, obj.path[(i + 1) % obj.path.length].y);
          center = graphs.intersection_2line(graphs.perpendicular_bisector(graphs.line(p1, p3)), graphs.perpendicular_bisector(graphs.line(p2, p3)));
          //console.log([center.x,center.y]);
          if (isFinite(center.x) && isFinite(center.y))
          {
            r = graphs.length(center, p3);
            a1 = Math.atan2(p1.y - center.y, p1.x - center.x);
            a2 = Math.atan2(p2.y - center.y, p2.x - center.x);
            a3 = Math.atan2(p3.y - center.y, p3.x - center.x);
            acw = (a2 < a3 && a3 < a1) || (a1 < a2 && a2 < a3) || (a3 < a1 && a1 < a2); //p1->p3->The direction of rotation of p2, counterclockwise is true

            ctx.arc(center.x, center.y, r, a1, a2, acw);
          }
          else
          {
            //Arc three points collinear, treated as line segments
            ctx.lineTo(obj.path[(i + 2) % obj.path.length].x, obj.path[(i + 2) % obj.path.length].y);
          }

        }
        else if (!obj.path[(i + 1) % obj.path.length].arc && !obj.path[i % obj.path.length].arc)
        {
          ctx.lineTo(obj.path[(i + 1) % obj.path.length].x, obj.path[(i + 1) % obj.path.length].y);
        }
      }
      this.fillGlass(obj.p);
    }
    ctx.lineWidth = 1;


    for (var i = 0; i < obj.path.length; i++)
    {
      if (typeof obj.path[i].arc != 'undefined')
      {
        if (obj.path[i].arc)
        {
          ctx.fillStyle = 'rgb(255,0,255)';
          //ctx.fillStyle="indigo";
          ctx.fillRect(obj.path[i].x - 2, obj.path[i].y - 2, 3, 3);
        }
        else
        {
          ctx.fillStyle = 'rgb(255,0,0)';
          ctx.fillRect(obj.path[i].x - 2, obj.path[i].y - 2, 3, 3);
        }
      }
    }
  },

  fillGlass: function(n)
  {
    if (n >= 1)
    {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'white';
      //ctx.fillStyle="rgb(128,128,128)";
      //ctx.globalAlpha=1-(1/n);
      ctx.globalAlpha = Math.log(n) / Math.log(1.5) * 0.2;

      //ctx.globalAlpha=0.3;
      ctx.fill('evenodd');
      //ctx.fill();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

    }
    else
    {

      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgb(70,70,70)';
      ctx.lineWidth = 1;
      ctx.stroke();

    }

  },

  //=================================Pan object ====================================
  move: function(obj, diffX, diffY) {
    for (var i = 0; i < obj.path.length; i++)
    {
      obj.path[i].x += diffX;
      obj.path[i].y += diffY;
    }
  },


  //==========================When the drawing area is pressed (the part where the object is pressed)===========================
  clicked: function(obj, mouse_nogrid, mouse, draggingPart) {

    var p1;
    var p2;
    var p3;
    var center;
    var r;
    var a1;
    var a2;
    var a3;


    var click_lensq = Infinity;
    var click_lensq_temp;
    var targetPoint_index = -1;
    for (var i = 0; i < obj.path.length; i++)
    {
      if (mouseOnPoint(mouse_nogrid, obj.path[i]))
      {
        click_lensq_temp = graphs.length_squared(mouse_nogrid, obj.path[i]);
        if (click_lensq_temp <= click_lensq)
        {
          click_lensq = click_lensq_temp;
          targetPoint_index = i;
        }
      }
    }
    if (targetPoint_index != -1)
    {
      draggingPart.part = 1;
      draggingPart.index = targetPoint_index;
      draggingPart.targetPoint = graphs.point(obj.path[targetPoint_index].x, obj.path[targetPoint_index].y);
      return true;
    }

    for (var i = 0; i < obj.path.length; i++)
    {
      if (obj.path[(i + 1) % obj.path.length].arc && !obj.path[i % obj.path.length].arc)
      {
        p1 = graphs.point(obj.path[i % obj.path.length].x, obj.path[i % obj.path.length].y);
        p2 = graphs.point(obj.path[(i + 2) % obj.path.length].x, obj.path[(i + 2) % obj.path.length].y);
        p3 = graphs.point(obj.path[(i + 1) % obj.path.length].x, obj.path[(i + 1) % obj.path.length].y);
        center = graphs.intersection_2line(graphs.perpendicular_bisector(graphs.line(p1, p3)), graphs.perpendicular_bisector(graphs.line(p2, p3)));
        if (isFinite(center.x) && isFinite(center.y))
        {
          r = graphs.length(center, p3);
          a1 = Math.atan2(p1.y - center.y, p1.x - center.x);
          a2 = Math.atan2(p2.y - center.y, p2.x - center.x);
          a3 = Math.atan2(p3.y - center.y, p3.x - center.x);
          var a_m = Math.atan2(mouse_nogrid.y - center.y, mouse_nogrid.x - center.x);
          if (Math.abs(graphs.length(center, mouse_nogrid) - r) < clickExtent_line && (((a2 < a3 && a3 < a1) || (a1 < a2 && a2 < a3) || (a3 < a1 && a1 < a2)) == ((a2 < a_m && a_m < a1) || (a1 < a2 && a2 < a_m) || (a_m < a1 && a1 < a2))))
          {
            //Drag the entire object
            draggingPart.part = 0;
            draggingPart.mouse0 = mouse; //The position of the mouse when you start dragging
            draggingPart.mouse1 = mouse; //The position of the mouse on the previous point when dragging
            draggingPart.snapData = {};
            return true;
          }
        }
        else
        {
          //Arc three points collinear, treated as line segments
          if (mouseOnSegment(mouse_nogrid, graphs.segment(obj.path[(i) % obj.path.length], obj.path[(i + 2) % obj.path.length])))
          {
            //Drag the entire object
            draggingPart.part = 0;
            draggingPart.mouse0 = mouse; //The position of the mouse when you start dragging
            draggingPart.mouse1 = mouse; //The position of the mouse on the previous point when dragging
            draggingPart.snapData = {};
            return true;
          }
        }

      }
      else if (!obj.path[(i + 1) % obj.path.length].arc && !obj.path[i % obj.path.length].arc)
      {
        if (mouseOnSegment(mouse_nogrid, graphs.segment(obj.path[(i) % obj.path.length], obj.path[(i + 1) % obj.path.length])))
        {
          //Drag the entire object
          draggingPart.part = 0;
          draggingPart.mouse0 = mouse; //The position of the mouse when you start dragging
          draggingPart.mouse1 = mouse; //The position of the mouse on the previous point when dragging
          draggingPart.snapData = {};
          return true;
        }
      }
    }

  },

  //=================================When dragging objects ====================================
  dragging: function(obj, mouse, draggingPart, ctrl, shift) {
    if (draggingPart.part == 1)
    {
      obj.path[draggingPart.index].x = mouse.x;
      obj.path[draggingPart.index].y = mouse.y;
    }

    if (draggingPart.part == 0)
    {
      if (shift)
      {
        var mouse_snapped = snapToDirection(mouse, draggingPart.mouse0, [{x: 1, y: 0},{x: 0, y: 1}], draggingPart.snapData);
      }
      else
      {
        var mouse_snapped = mouse;
        draggingPart.snapData = {}; //Release the original drag direction lock when releasing shift
      }
      this.move(obj, mouse_snapped.x - draggingPart.mouse1.x, mouse_snapped.y - draggingPart.mouse1.y);
      draggingPart.mouse1 = mouse_snapped;
    }
  },



  //====================Determine if a light will hit the object (if it is, then pass back the intersection)====================
  rayIntersection: function(obj, ray) {

    if (obj.notDone || obj.p <= 0)return;

    var s_lensq = Infinity;
    var s_lensq_temp;
    var s_point = null;
    var s_point_temp = null;
    //var a_rp;
    var rp_exist = [];
    var rp_lensq = [];
    var rp_temp;

    var p1;
    var p2;
    var p3;
    var center;
    var r;
    //var pathInvalid=false;

    for (var i = 0; i < obj.path.length; i++)
    {
      s_point_temp = null;
      if (obj.path[(i + 1) % obj.path.length].arc && !obj.path[i % obj.path.length].arc)
      {
        //Arc i-&gt; i 1-&gt; i 2
        p1 = graphs.point(obj.path[i % obj.path.length].x, obj.path[i % obj.path.length].y);
        p2 = graphs.point(obj.path[(i + 2) % obj.path.length].x, obj.path[(i + 2) % obj.path.length].y);
        p3 = graphs.point(obj.path[(i + 1) % obj.path.length].x, obj.path[(i + 1) % obj.path.length].y);
        center = graphs.intersection_2line(graphs.perpendicular_bisector(graphs.line(p1, p3)), graphs.perpendicular_bisector(graphs.line(p2, p3)));
        if (isFinite(center.x) && isFinite(center.y))
        {
          r = graphs.length(center, p3);
          rp_temp = graphs.intersection_line_circle(graphs.line(ray.p1, ray.p2), graphs.circle(center, p2));   //The intersection of the light (extension line) and the mirror
          for (var ii = 1; ii <= 2; ii++)
          {
            rp_exist[ii] = !graphs.intersection_is_on_segment(graphs.intersection_2line(graphs.line(p1, p2), graphs.line(p3, rp_temp[ii])), graphs.segment(p3, rp_temp[ii])) && graphs.intersection_is_on_ray(rp_temp[ii], ray) && graphs.length_squared(rp_temp[ii], ray.p1) > minShotLength_squared;
            rp_lensq[ii] = graphs.length_squared(ray.p1, rp_temp[ii]); //The distance the light hits the i-th intersection
          }
          if (rp_exist[1] && ((!rp_exist[2]) || rp_lensq[1] < rp_lensq[2]) && rp_lensq[1] > minShotLength_squared)
          {
            s_point_temp = rp_temp[1];
            s_lensq_temp = rp_lensq[1];
          }
          if (rp_exist[2] && ((!rp_exist[1]) || rp_lensq[2] < rp_lensq[1]) && rp_lensq[2] > minShotLength_squared)
          {
            s_point_temp = rp_temp[2];
            s_lensq_temp = rp_lensq[2];
          }
        }
        else
        {
          //Arc three points collinear, treated as line segments
          //Line stage i-&gt; i 2
          var rp_temp = graphs.intersection_2line(graphs.line(ray.p1, ray.p2), graphs.line(obj.path[i % obj.path.length], obj.path[(i + 2) % obj.path.length]));   //The intersection of the light (extension line) and the object (extension line)

          if (graphs.intersection_is_on_segment(rp_temp, graphs.segment(obj.path[i % obj.path.length], obj.path[(i + 2) % obj.path.length])) && graphs.intersection_is_on_ray(rp_temp, ray) && graphs.length_squared(ray.p1, rp_temp) > minShotLength_squared)
          {
            //If rp_temp is on ray and rp_temp is on obj (ie ray really hits obj, not the extended line of ray hits or hits the extension line of obj)
            s_lensq_temp = graphs.length_squared(ray.p1, rp_temp); //The distance from the intersection to the [head of the light]
            s_point_temp = rp_temp;
          }
        }
      }
      else if (!obj.path[(i + 1) % obj.path.length].arc && !obj.path[i % obj.path.length].arc)
      {
        //Line stage i-&gt; i 1
        var rp_temp = graphs.intersection_2line(graphs.line(ray.p1, ray.p2), graphs.line(obj.path[i % obj.path.length], obj.path[(i + 1) % obj.path.length]));   //The intersection of the light (extension line) and the object (extension line)

        if (graphs.intersection_is_on_segment(rp_temp, graphs.segment(obj.path[i % obj.path.length], obj.path[(i + 1) % obj.path.length])) && graphs.intersection_is_on_ray(rp_temp, ray) && graphs.length_squared(ray.p1, rp_temp) > minShotLength_squared)
        {
          //If rp_temp is on ray and rp_temp is on obj (ie ray really hits obj, not the extended line of ray hits or hits the extension line of obj)
          s_lensq_temp = graphs.length_squared(ray.p1, rp_temp); //The distance from the intersection to the [head of the light]
          s_point_temp = rp_temp;
        }
      }
      if (s_point_temp)
      {
        if (s_lensq_temp < s_lensq)
        {
          s_lensq = s_lensq_temp;
          s_point = s_point_temp;
        }
      }
    }
    if (s_point)
    {
      return s_point;
    }

  },

  //=============================When the object is shot by light================================
  shot: function(obj, ray, rayIndex, rp, surfaceMerging_objs) {

    if (obj.notDone) {return;}
    //var ctx = canvas.getContext('2d');
    //ctx.beginPath();
    //ctx.moveTo(obj.path[0].x,obj.path[0].y);
    var shotData = this.getShotData(obj, ray);
    var shotType = shotData.shotType;
    if (shotType == 1)
    {
      //Shooting from the inside to the outside
      var n1 = obj.p; //The refractive index of the source medium (the destination medium is assumed to be 1)
      //canvasPainter.draw(graphs.segment(ray.p1,s_point),canvas,"red");
    }
    else if (shotType == -1)
    {
      //Shooting from the outside to the inside
      var n1 = 1 / obj.p;
    }
    else if (shotType == 0)
    {
      //Equivalent to not shooting (for example, two interfaces coincide)
      var n1 = 1;
    }
    else
    {
      //Conditions that may cause a bug (such as hitting a boundary point)
      //To prevent misunderstanding caused by light in the wrong direction, absorb light
      ray.exist = false;
      return;
    }

    //Interface fusion
    for (var i = 0; i < surfaceMerging_objs.length; i++)
    {
      shotType = objTypes[surfaceMerging_objs[i].type].getShotType(surfaceMerging_objs[i], ray);
      if (shotType == 1)
      {
        //Shooting from the inside to the outside
        n1 *= surfaceMerging_objs[i].p;
      }
      else if (shotType == -1)
      {
        //Shooting from the outside to the inside
        n1 /= surfaceMerging_objs[i].p;
      }
      else if (shotType == 0)
      {
        //Equivalent to not shooting (for example, two interfaces coincide)
        //n1=n1;
      }
      else
      {
        //Conditions that may cause a bug (such as hitting a boundary point)
        //To prevent misunderstanding caused by light in the wrong direction, absorb light
        ray.exist = false;
        return;
      }
    }

    this.refract(ray, rayIndex, shotData.s_point, shotData.normal, n1);
  },

  //=========================Judge the inside/outside of the light==============================
  getShotType: function(obj, ray) {
    return this.getShotData(obj, ray).shotType;
  },


  getShotData: function(obj, ray) {
    //=========Determine where the light hits the object==========
    var s_lensq = Infinity;
    var s_lensq_temp;
    var s_point = null;
    var s_point_temp = null;
    var s_point_index;

    var surfaceMultiplicity = 1; //Number of interface overlaps

    var rp_on_ray = [];
    var rp_exist = [];
    var rp_lensq = [];
    var rp_temp;

    var rp2_exist = [];
    var rp2_lensq = [];
    var rp2_temp;

    var normal_x;
    var normal_x_temp;

    var normal_y;
    var normal_y_temp;

    var rdots;
    var ssq;

    var nearEdge = false;
    var nearEdge_temp = false;

    var p1;
    var p2;
    var p3;
    var center;
    var ray2 = graphs.ray(ray.p1, graphs.point(ray.p2.x + Math.random() * 1e-5, ray.p2.y + Math.random() * 1e-5)); //Light used as internal and external judgment (test light)
    var ray_intersect_count = 0; //Test the number of intersections of light and object (odd number indicates light from inside)

    for (var i = 0; i < obj.path.length; i++)
    {
      s_point_temp = null;
      nearEdge_temp = false;
      if (obj.path[(i + 1) % obj.path.length].arc && !obj.path[i % obj.path.length].arc)
      {
        //Arc i-&gt; i 1-&gt; i 2
        p1 = graphs.point(obj.path[i % obj.path.length].x, obj.path[i % obj.path.length].y);
        p2 = graphs.point(obj.path[(i + 2) % obj.path.length].x, obj.path[(i + 2) % obj.path.length].y);
        p3 = graphs.point(obj.path[(i + 1) % obj.path.length].x, obj.path[(i + 1) % obj.path.length].y);
        center = graphs.intersection_2line(graphs.perpendicular_bisector(graphs.line(p1, p3)), graphs.perpendicular_bisector(graphs.line(p2, p3)));
        if (isFinite(center.x) && isFinite(center.y))
        {
          rp_temp = graphs.intersection_line_circle(graphs.line(ray.p1, ray.p2), graphs.circle(center, p2));   //The intersection of the light (extension line) and the mirror
          rp2_temp = graphs.intersection_line_circle(graphs.line(ray2.p1, ray2.p2), graphs.circle(center, p2));
          for (var ii = 1; ii <= 2; ii++)
          {


            rp_on_ray[ii] = graphs.intersection_is_on_ray(rp_temp[ii], ray);
            rp_exist[ii] = rp_on_ray[ii] && !graphs.intersection_is_on_segment(graphs.intersection_2line(graphs.line(p1, p2), graphs.line(p3, rp_temp[ii])), graphs.segment(p3, rp_temp[ii])) && graphs.length_squared(rp_temp[ii], ray.p1) > minShotLength_squared;
            rp_lensq[ii] = graphs.length_squared(ray.p1, rp_temp[ii]); //The distance the light hits the i-th intersection

            rp2_exist[ii] = !graphs.intersection_is_on_segment(graphs.intersection_2line(graphs.line(p1, p2), graphs.line(p3, rp2_temp[ii])), graphs.segment(p3, rp2_temp[ii])) && graphs.intersection_is_on_ray(rp2_temp[ii], ray2) && graphs.length_squared(rp2_temp[ii], ray2.p1) > minShotLength_squared;
            rp2_lensq[ii] = graphs.length_squared(ray2.p1, rp2_temp[ii]);
          }

          if (rp_exist[1] && ((!rp_exist[2]) || rp_lensq[1] < rp_lensq[2]) && rp_lensq[1] > minShotLength_squared)
          {
            s_point_temp = rp_temp[1];
            s_lensq_temp = rp_lensq[1];
            if (rp_on_ray[2] && rp_lensq[1] < rp_lensq[2])
            {
              //Light from outside to inside (for the arc itself)
              normal_x_temp = s_point_temp.x - center.x;
              normal_y_temp = s_point_temp.y - center.y;
            }
            else
            {
              normal_x_temp = center.x - s_point_temp.x;
              normal_y_temp = center.y - s_point_temp.y;
            }
          }
          if (rp_exist[2] && ((!rp_exist[1]) || rp_lensq[2] < rp_lensq[1]) && rp_lensq[2] > minShotLength_squared)
          {
            s_point_temp = rp_temp[2];
            s_lensq_temp = rp_lensq[2];
            if (rp_on_ray[1] && rp_lensq[2] < rp_lensq[1])
            {
              //Light from outside to inside (for the arc itself)
              normal_x_temp = s_point_temp.x - center.x;
              normal_y_temp = s_point_temp.y - center.y;
            }
            else
            {
              normal_x_temp = center.x - s_point_temp.x;
              normal_y_temp = center.y - s_point_temp.y;
            }
          }
          if (rp2_exist[1] && rp2_lensq[1] > minShotLength_squared)
          {
            ray_intersect_count++;
            //canvasPainter.draw(ray2,canvas,"white");
          }
          if (rp2_exist[2] && rp2_lensq[2] > minShotLength_squared)
          {
            ray_intersect_count++;
          }

          //Judging too close to the boundary
          if (s_point_temp && (graphs.length_squared(s_point_temp, p1) < minShotLength_squared || graphs.length_squared(s_point_temp, p2) < minShotLength_squared))
          {
            nearEdge_temp = true;
          }

        }
        else
        {
          //Arc three points collinear, treated as line segments
          //Line stage i-&gt; i 2
          rp_temp = graphs.intersection_2line(graphs.line(ray.p1, ray.p2), graphs.line(obj.path[i % obj.path.length], obj.path[(i + 2) % obj.path.length]));   //The intersection of the light (extension line) and the object (extension line)

          rp2_temp = graphs.intersection_2line(graphs.line(ray2.p1, ray2.p2), graphs.line(obj.path[i % obj.path.length], obj.path[(i + 2) % obj.path.length]));   //The intersection of the light (extension line) and the object (extension line)
          if (graphs.intersection_is_on_segment(rp_temp, graphs.segment(obj.path[i % obj.path.length], obj.path[(i + 2) % obj.path.length])) && graphs.intersection_is_on_ray(rp_temp, ray) && graphs.length_squared(ray.p1, rp_temp) > minShotLength_squared)
          {
            //If rp_temp is on ray and rp_temp is on obj (ie ray really hits obj, not the extended line of ray hits or hits the extension line of obj)
            //ray_intersect_count++;
            s_lensq_temp = graphs.length_squared(ray.p1, rp_temp); //The distance from the intersection to the [head of the light]
            s_point_temp = rp_temp;

            rdots = (ray.p2.x - ray.p1.x) * (obj.path[(i + 2) % obj.path.length].x - obj.path[i % obj.path.length].x) + (ray.p2.y - ray.p1.y) * (obj.path[(i + 2) % obj.path.length].y - obj.path[i % obj.path.length].y); //Ray and the inner product of this line segment
            ssq = (obj.path[(i + 2) % obj.path.length].x - obj.path[i % obj.path.length].x) * (obj.path[(i + 2) % obj.path.length].x - obj.path[i % obj.path.length].x) + (obj.path[(i + 2) % obj.path.length].y - obj.path[i % obj.path.length].y) * (obj.path[(i + 2) % obj.path.length].y - obj.path[i % obj.path.length].y); //The length of this line segment is squared

            normal_x_temp = rdots * (obj.path[(i + 2) % obj.path.length].x - obj.path[i % obj.path.length].x) - ssq * (ray.p2.x - ray.p1.x);
            normal_y_temp = rdots * (obj.path[(i + 2) % obj.path.length].y - obj.path[i % obj.path.length].y) - ssq * (ray.p2.y - ray.p1.y);


          }

          if (graphs.intersection_is_on_segment(rp2_temp, graphs.segment(obj.path[i % obj.path.length], obj.path[(i + 2) % obj.path.length])) && graphs.intersection_is_on_ray(rp2_temp, ray2) && graphs.length_squared(ray2.p1, rp2_temp) > minShotLength_squared)
          {
            ray_intersect_count++;
          }

          //Judging too close to the boundary
          if (s_point_temp && (graphs.length_squared(s_point_temp, obj.path[i % obj.path.length]) < minShotLength_squared || graphs.length_squared(s_point_temp, obj.path[(i + 2) % obj.path.length]) < minShotLength_squared))
          {
            nearEdge_temp = true;
          }
          //ctx.lineTo(obj.path[(i+2)%obj.path.length].x,obj.path[(i+2)%obj.path.length].y);
        }
      }
      else if (!obj.path[(i + 1) % obj.path.length].arc && !obj.path[i % obj.path.length].arc)
      {
        //Line segment i->i+1
        rp_temp = graphs.intersection_2line(graphs.line(ray.p1, ray.p2), graphs.line(obj.path[i % obj.path.length], obj.path[(i + 1) % obj.path.length]));   //The intersection of the light (extension line) and the object (extension line)

        rp2_temp = graphs.intersection_2line(graphs.line(ray2.p1, ray2.p2), graphs.line(obj.path[i % obj.path.length], obj.path[(i + 1) % obj.path.length]));   //The intersection of the light (extension line) and the object (extension line)
        if (graphs.intersection_is_on_segment(rp_temp, graphs.segment(obj.path[i % obj.path.length], obj.path[(i + 1) % obj.path.length])) && graphs.intersection_is_on_ray(rp_temp, ray) && graphs.length_squared(ray.p1, rp_temp) > minShotLength_squared)
        {
          //If rp_temp is on ray and rp_temp is on obj (ie ray really hits obj, not the extended line of ray hits or hits the extension line of obj)
          //ray_intersect_count++;
          s_lensq_temp = graphs.length_squared(ray.p1, rp_temp); //The distance from the intersection to the [head of the light]
          s_point_temp = rp_temp;

          rdots = (ray.p2.x - ray.p1.x) * (obj.path[(i + 1) % obj.path.length].x - obj.path[i % obj.path.length].x) + (ray.p2.y - ray.p1.y) * (obj.path[(i + 1) % obj.path.length].y - obj.path[i % obj.path.length].y); //rayWith the inner segment of this line segment
          ssq = (obj.path[(i + 1) % obj.path.length].x - obj.path[i % obj.path.length].x) * (obj.path[(i + 1) % obj.path.length].x - obj.path[i % obj.path.length].x) + (obj.path[(i + 1) % obj.path.length].y - obj.path[i % obj.path.length].y) * (obj.path[(i + 1) % obj.path.length].y - obj.path[i % obj.path.length].y); //The length of this line segment is squared

          normal_x_temp = rdots * (obj.path[(i + 1) % obj.path.length].x - obj.path[i % obj.path.length].x) - ssq * (ray.p2.x - ray.p1.x);
          normal_y_temp = rdots * (obj.path[(i + 1) % obj.path.length].y - obj.path[i % obj.path.length].y) - ssq * (ray.p2.y - ray.p1.y);


        }

        if (graphs.intersection_is_on_segment(rp2_temp, graphs.segment(obj.path[i % obj.path.length], obj.path[(i + 1) % obj.path.length])) && graphs.intersection_is_on_ray(rp2_temp, ray2) && graphs.length_squared(ray2.p1, rp2_temp) > minShotLength_squared)
        {
          ray_intersect_count++;
        }

        //Judging too close to the boundary
        if (s_point_temp && (graphs.length_squared(s_point_temp, obj.path[i % obj.path.length]) < minShotLength_squared || graphs.length_squared(s_point_temp, obj.path[(i + 1) % obj.path.length]) < minShotLength_squared))
        {
          nearEdge_temp = true;
        }
      }
      if (s_point_temp)
      {
        if (s_point && graphs.length_squared(s_point_temp, s_point) < minShotLength_squared)
        {
          //Self-interface fusion
          surfaceMultiplicity++;
        }
        else if (s_lensq_temp < s_lensq)
        {
          s_lensq = s_lensq_temp;
          s_point = s_point_temp;
          s_point_index = i;
          normal_x = normal_x_temp;
          normal_y = normal_y_temp;
          nearEdge = nearEdge_temp;
          surfaceMultiplicity = 1;
        }
      }
    }


    if (nearEdge)
    {
      var shotType = 2; //Shoot to the boundary point
    }
    else if (surfaceMultiplicity % 2 == 0)
    {
      var shotType = 0; //Equivalent to not shooting
    }
    else if (ray_intersect_count % 2 == 1)
    {
      var shotType = 1; //Shooting from the inside to the outside
    }
    else
    {
      var shotType = -1; //Shooting from the outside to the inside
    }

    return {s_point: s_point, normal: {x: normal_x, y: normal_y},shotType: shotType};
  },

  //=========================Refraction processing==============================
  refract: function(ray, rayIndex, s_point, normal, n1)
  {
    var normal_len = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
    var normal_x = normal.x / normal_len;
    var normal_y = normal.y / normal_len;

    var ray_len = Math.sqrt((ray.p2.x - ray.p1.x) * (ray.p2.x - ray.p1.x) + (ray.p2.y - ray.p1.y) * (ray.p2.y - ray.p1.y));

    var ray_x = (ray.p2.x - ray.p1.x) / ray_len;
    var ray_y = (ray.p2.y - ray.p1.y) / ray_len;


    //reference: http://en.wikipedia.org/wiki/Snell%27s_law#Vector_form

    var cos1 = -normal_x * ray_x - normal_y * ray_y;
    //console.log(cos1)
    var sq1 = 1 - n1 * n1 * (1 - cos1 * cos1);


    if (sq1 < 0)
    {
      //Total reflection
      //var a_out=a_n*2-a_r;
      ray.p1 = s_point;
      ray.p2 = graphs.point(s_point.x + ray_x + 2 * cos1 * normal_x, s_point.y + ray_y + 2 * cos1 * normal_y);


    }
    else
    {
      //refraction
      var cos2 = Math.sqrt(sq1);

      var R_s = Math.pow((n1 * cos1 - cos2) / (n1 * cos1 + cos2), 2);
      var R_p = Math.pow((n1 * cos2 - cos1) / (n1 * cos2 + cos1), 2);
      var R = 0.5 * (R_s + R_p);
      //reference: http://en.wikipedia.org/wiki/Fresnel_equations#Definitions_and_power_equations

      //Processing reflected light
      var ray2 = graphs.ray(s_point, graphs.point(s_point.x + ray_x + 2 * cos1 * normal_x, s_point.y + ray_y + 2 * cos1 * normal_y));
      ray2.brightness = ray.brightness * R;
      ray2.gap = ray.gap;
      if (ray2.brightness > 0.01)
      {
        //Add reflected light to the waiting area
        addRay(ray2);
      }
      else if (!ray.gap)
      {
        var amp = Math.floor(0.01 / ray2.brightness) + 1;
        if (rayIndex % amp == 0)
        {
          ray2.brightness = ray2.brightness * amp;
          addRay(ray2);
        }
      }

      //Processing refracted light
      ray.p1 = s_point;
      ray.p2 = graphs.point(s_point.x + n1 * ray_x + (n1 * cos1 - cos2) * normal_x, s_point.y + n1 * ray_y + (n1 * cos1 - cos2) * normal_y);
      ray.brightness = ray.brightness * (1 - R);

    }
  }


  };

  //"laser" Property
  objTypes['laser'] = {

  //======================================Create object=========================================
  create: function(mouse) {
    return {type: 'laser', p1: mouse, p2: mouse};
  },

  //Using the lineobj prototype
  c_mousedown: objTypes['lineobj'].c_mousedown,
  c_mousemove: objTypes['lineobj'].c_mousemove,
  c_mouseup: objTypes['lineobj'].c_mouseup,
  move: objTypes['lineobj'].move,
  clicked: objTypes['lineobj'].clicked,
  dragging: objTypes['lineobj'].dragging,

  //=================================Draw objects onto the Canvas====================================
  draw: function(obj, canvas) {
  //var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillRect(obj.p1.x - 2, obj.p1.y - 2, 5, 5);
  ctx.fillRect(obj.p2.x - 2, obj.p2.y - 2, 3, 3);
  },


  //=================================Emission light=============================================
  shoot: function(obj) {
  var ray1 = graphs.ray(obj.p1, obj.p2);
  ray1.brightness = 1;
  ray1.gap = true;
  ray1.isNew = true;
  addRay(ray1);
  }




  };

  //"mirror"(mirror) object
  objTypes['mirror'] = {

  //======================================Create object=========================================
  create: function(mouse) {
    return {type: 'mirror', p1: mouse, p2: mouse};
  },

  //Using the lineobj prototype
  c_mousedown: objTypes['lineobj'].c_mousedown,
  c_mousemove: objTypes['lineobj'].c_mousemove,
  c_mouseup: objTypes['lineobj'].c_mouseup,
  move: objTypes['lineobj'].move,
  clicked: objTypes['lineobj'].clicked,
  dragging: objTypes['lineobj'].dragging,
  rayIntersection: objTypes['lineobj'].rayIntersection,

  //=================================Draw objects onto the Canvas====================================
  draw: function(obj, canvas) {
    //ctx.lineWidth=1.5;
    ctx.strokeStyle = 'rgb(168,168,168)';
    ctx.beginPath();
    ctx.moveTo(obj.p1.x, obj.p1.y);
    ctx.lineTo(obj.p2.x, obj.p2.y);
    ctx.stroke();
    //ctx.lineWidth=1;
  },



  //=============================When the object is shot by light================================
  shot: function(mirror, ray, rayIndex, rp) {
    //At this point, the representative light must be shot in the mirror, just find the intersection, no need to judge whether it is really shot.
    var rx = ray.p1.x - rp.x;
    var ry = ray.p1.y - rp.y;
    var mx = mirror.p2.x - mirror.p1.x;
    var my = mirror.p2.y - mirror.p1.y;
    ray.p1 = rp;
    ray.p2 = graphs.point(rp.x + rx * (my * my - mx * mx) - 2 * ry * mx * my, rp.y + ry * (mx * mx - my * my) - 2 * rx * mx * my);
  }





  };

  //"lens"(lens) object
  objTypes['lens'] = {

  p_name: 'Focal length', //Attribute name
  p_min: -1000,
  p_max: 1000,
  p_step: 1,

  //======================================Create object=========================================
  create: function(mouse) {
    return {type: 'lens', p1: mouse, p2: mouse, p: 100};
  },

  //Using the lineobj prototype
  c_mousedown: objTypes['lineobj'].c_mousedown,
  c_mousemove: objTypes['lineobj'].c_mousemove,
  c_mouseup: objTypes['lineobj'].c_mouseup,
  move: objTypes['lineobj'].move,
  clicked: objTypes['lineobj'].clicked,
  dragging: objTypes['lineobj'].dragging,
  rayIntersection: objTypes['lineobj'].rayIntersection,

  //=================================Draw objects onto the Canvas====================================
  draw: function(obj, canvas) {
  //var ctx = canvas.getContext('2d');

  var len = Math.sqrt((obj.p2.x - obj.p1.x) * (obj.p2.x - obj.p1.x) + (obj.p2.y - obj.p1.y) * (obj.p2.y - obj.p1.y));
  var par_x = (obj.p2.x - obj.p1.x) / len;
  var par_y = (obj.p2.y - obj.p1.y) / len;
  var per_x = par_y;
  var per_y = -par_x;

  var arrow_size_per = 5;
  var arrow_size_par = 5;
  var center_size = 2;

  //Draw line
  ctx.strokeStyle = 'rgb(128,128,128)';
  ctx.globalAlpha = 1 / ((Math.abs(obj.p) / 100) + 1);
  //ctx.globalAlpha=0.3;
  ctx.lineWidth = 4;
  //ctx.lineCap = "round"
  ctx.beginPath();
  ctx.moveTo(obj.p1.x, obj.p1.y);
  ctx.lineTo(obj.p2.x, obj.p2.y);
  ctx.stroke();
  ctx.lineWidth = 1;
  //ctx.lineCap = "butt"


  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgb(255,0,0)';

  //Draw the center point of the lens
  var center = graphs.midpoint(obj);
  ctx.strokeStyle = 'rgb(255,255,255)';
  ctx.beginPath();
  ctx.moveTo(center.x - per_x * center_size, center.y - per_y * center_size);
  ctx.lineTo(center.x + per_x * center_size, center.y + per_y * center_size);
  ctx.stroke();

  if (obj.p > 0)
  {
    //drawing arrow (p1)
    ctx.beginPath();
    ctx.moveTo(obj.p1.x - par_x * arrow_size_par, obj.p1.y - par_y * arrow_size_par);
    ctx.lineTo(obj.p1.x + par_x * arrow_size_par + per_x * arrow_size_per, obj.p1.y + par_y * arrow_size_par + per_y * arrow_size_per);
    ctx.lineTo(obj.p1.x + par_x * arrow_size_par - per_x * arrow_size_per, obj.p1.y + par_y * arrow_size_par - per_y * arrow_size_per);
    ctx.fill();

    //Draw arrow (p2)
    ctx.beginPath();
    ctx.moveTo(obj.p2.x + par_x * arrow_size_par, obj.p2.y + par_y * arrow_size_par);
    ctx.lineTo(obj.p2.x - par_x * arrow_size_par + per_x * arrow_size_per, obj.p2.y - par_y * arrow_size_par + per_y * arrow_size_per);
    ctx.lineTo(obj.p2.x - par_x * arrow_size_par - per_x * arrow_size_per, obj.p2.y - par_y * arrow_size_par - per_y * arrow_size_per);
    ctx.fill();
  }
  if (obj.p < 0)
  {
    //Draw arrow (p1)
    ctx.beginPath();
    ctx.moveTo(obj.p1.x + par_x * arrow_size_par, obj.p1.y + par_y * arrow_size_par);
    ctx.lineTo(obj.p1.x - par_x * arrow_size_par + per_x * arrow_size_per, obj.p1.y - par_y * arrow_size_par + per_y * arrow_size_per);
    ctx.lineTo(obj.p1.x - par_x * arrow_size_par - per_x * arrow_size_per, obj.p1.y - par_y * arrow_size_par - per_y * arrow_size_per);
    ctx.fill();

    //Draw arrow (p2)
    ctx.beginPath();
    ctx.moveTo(obj.p2.x - par_x * arrow_size_par, obj.p2.y - par_y * arrow_size_par);
    ctx.lineTo(obj.p2.x + par_x * arrow_size_par + per_x * arrow_size_per, obj.p2.y + par_y * arrow_size_par + per_y * arrow_size_per);
    ctx.lineTo(obj.p2.x + par_x * arrow_size_par - per_x * arrow_size_per, obj.p2.y + par_y * arrow_size_par - per_y * arrow_size_per);
    ctx.fill();
  }

  },



  //=============================When the object is shot by light================================
  shot: function(lens, ray, rayIndex, shootPoint) {

    var lens_length = graphs.length_segment(lens);
    var main_line_unitvector_x = (-lens.p1.y + lens.p2.y) / lens_length;
    var main_line_unitvector_y = (lens.p1.x - lens.p2.x) / lens_length;
    //(-l1.p1.y+l1.p2.y+l1.p1.x+l1.p2.x)*0.5,(l1.p1.x-l1.p2.x+l1.p1.y+l1.p2.y)*0.5
    var mid_point = graphs.midpoint(lens); //Lens center point

    var twoF_point_1 = graphs.point(mid_point.x + main_line_unitvector_x * 2 * lens.p, mid_point.y + main_line_unitvector_y * 2 * lens.p);  //Double focal length point 1
    var twoF_point_2 = graphs.point(mid_point.x - main_line_unitvector_x * 2 * lens.p, mid_point.y - main_line_unitvector_y * 2 * lens.p);  //Double focal length point 2

    var twoF_line_near, twoF_line_far;
    if (graphs.length_squared(ray.p1, twoF_point_1) < graphs.length_squared(ray.p1, twoF_point_2))
    {
      //Double focal length point 1 and light on the same side
      twoF_line_near = graphs.parallel(lens, twoF_point_1);
      twoF_line_far = graphs.parallel(lens, twoF_point_2);
    }
    else
    {
      //Double focal length point 2 and light on the same side
      twoF_line_near = graphs.parallel(lens, twoF_point_2);
      twoF_line_far = graphs.parallel(lens, twoF_point_1);
    }


    if (lens.p > 0)
    {
      //Converging lens
      ray.p2 = graphs.intersection_2line(twoF_line_far, graphs.line(mid_point, graphs.intersection_2line(twoF_line_near, ray)));
      ray.p1 = shootPoint;
    }
    else
    {
      //Divergent lens
      ray.p2 = graphs.intersection_2line(twoF_line_far, graphs.line(shootPoint, graphs.intersection_2line(twoF_line_near, graphs.line(mid_point, graphs.intersection_2line(twoF_line_far, ray)))));
      ray.p1 = shootPoint;
    }
  }





  };

  //"idealmirror"(ideal curved mirror) object
  objTypes['idealmirror'] = {

  p_name: 'Focal length', //Attribute name(ideal curved mirror) object
  p_min: -1000,
  p_max: 1000,
  p_step: 1,

  //======================================Create object=========================================
  create: function(mouse) {
    return {type: 'idealmirror', p1: mouse, p2: graphs.point(mouse.x + gridSize, mouse.y), p: 100};
  },

  //Using the lineobj prototype
  c_mousedown: objTypes['lineobj'].c_mousedown,
  c_mousemove: objTypes['lineobj'].c_mousemove,
  c_mouseup: objTypes['lineobj'].c_mouseup,
  move: objTypes['lineobj'].move,
  clicked: objTypes['lineobj'].clicked,
  dragging: objTypes['lineobj'].dragging,
  rayIntersection: objTypes['lineobj'].rayIntersection,

  //=================================Draw objects onto the Canvas====================================
  draw: function(obj, canvas) {
  //var ctx = canvas.getContext('2d');

  var len = Math.sqrt((obj.p2.x - obj.p1.x) * (obj.p2.x - obj.p1.x) + (obj.p2.y - obj.p1.y) * (obj.p2.y - obj.p1.y));
  var par_x = (obj.p2.x - obj.p1.x) / len;
  var par_y = (obj.p2.y - obj.p1.y) / len;
  var per_x = par_y;
  var per_y = -par_x;

  var arrow_size_per = 5;
  var arrow_size_par = 5;
  var center_size = 1;

  //Draw line
  ctx.strokeStyle = 'rgb(168,168,168)';
  //ctx.globalAlpha=1/((Math.abs(obj.p)/100)+1);
  ctx.globalAlpha = 1;
  ctx.lineWidth = 1;
  //ctx.lineCap = "round"
  ctx.beginPath();
  ctx.moveTo(obj.p1.x, obj.p1.y);
  ctx.lineTo(obj.p2.x, obj.p2.y);
  ctx.stroke();
  ctx.lineWidth = 1;
  //ctx.lineCap = "butt"


  //Center point of the mirror
  var center = graphs.midpoint(obj);
  ctx.strokeStyle = 'rgb(255,255,255)';
  ctx.beginPath();
  ctx.moveTo(center.x - per_x * center_size, center.y - per_y * center_size);
  ctx.lineTo(center.x + per_x * center_size, center.y + per_y * center_size);
  ctx.stroke();



  //ctx.globalAlpha=1;
  ctx.fillStyle = 'rgb(255,0,0)';

  //Single-sided engraving arrows (the opposite focal lengths in both directions)
  /*
  if(obj.p>0)
  {
    //Draw arrow (p1)
    ctx.beginPath();
    ctx.moveTo(obj.p1.x+per_x*arrow_size_per2,obj.p1.y+per_y*arrow_size_per2);
    ctx.lineTo(obj.p1.x-per_x*arrow_size_per,obj.p1.y-per_y*arrow_size_per);
    ctx.lineTo(obj.p1.x+per_x*arrow_size_per2+par_x*arrow_size_par,obj.p1.y+per_y*arrow_size_per2+par_y*arrow_size_par);
    ctx.fill();

    //Draw arrow (p2)
    ctx.beginPath();
    ctx.moveTo(obj.p2.x+per_x*arrow_size_per2,obj.p2.y+per_y*arrow_size_per2);
    ctx.lineTo(obj.p2.x-per_x*arrow_size_per,obj.p2.y-per_y*arrow_size_per);
    ctx.lineTo(obj.p2.x+per_x*arrow_size_per2-par_x*arrow_size_par,obj.p2.y+per_y*arrow_size_per2-par_y*arrow_size_par);
    ctx.fill();
  }
  if(obj.p<0)
  {
    //Draw arrow (p1)
    ctx.beginPath();
    ctx.moveTo(obj.p1.x-per_x*arrow_size_per2,obj.p1.y-per_y*arrow_size_per2);
    ctx.lineTo(obj.p1.x+per_x*arrow_size_per,obj.p1.y+per_y*arrow_size_per);
    ctx.lineTo(obj.p1.x-per_x*arrow_size_per2+par_x*arrow_size_par,obj.p1.y-per_y*arrow_size_per2+par_y*arrow_size_par);
    ctx.fill();

    //Draw arrow (p2)
    ctx.beginPath();
    ctx.moveTo(obj.p2.x-per_x*arrow_size_per2,obj.p2.y-per_y*arrow_size_per2);
    ctx.lineTo(obj.p2.x+per_x*arrow_size_per,obj.p2.y+per_y*arrow_size_per);
    ctx.lineTo(obj.p2.x-per_x*arrow_size_per2-par_x*arrow_size_par,obj.p2.y-per_y*arrow_size_per2-par_y*arrow_size_par);
    ctx.fill();
  }
  */

  //Double-sided engraving arrow
  if (obj.p < 0)
  {
    //Draw arrow (p1)
    ctx.beginPath();
    ctx.moveTo(obj.p1.x - par_x * arrow_size_par, obj.p1.y - par_y * arrow_size_par);
    ctx.lineTo(obj.p1.x + par_x * arrow_size_par + per_x * arrow_size_per, obj.p1.y + par_y * arrow_size_par + per_y * arrow_size_per);
    ctx.lineTo(obj.p1.x + par_x * arrow_size_par - per_x * arrow_size_per, obj.p1.y + par_y * arrow_size_par - per_y * arrow_size_per);
    ctx.fill();

    //Draw arrow (p2)
    ctx.beginPath();
    ctx.moveTo(obj.p2.x + par_x * arrow_size_par, obj.p2.y + par_y * arrow_size_par);
    ctx.lineTo(obj.p2.x - par_x * arrow_size_par + per_x * arrow_size_per, obj.p2.y - par_y * arrow_size_par + per_y * arrow_size_per);
    ctx.lineTo(obj.p2.x - par_x * arrow_size_par - per_x * arrow_size_per, obj.p2.y - par_y * arrow_size_par - per_y * arrow_size_per);
    ctx.fill();
  }
  if (obj.p > 0)
  {
    //Draw arrow (p1)
    ctx.beginPath();
    ctx.moveTo(obj.p1.x + par_x * arrow_size_par, obj.p1.y + par_y * arrow_size_par);
    ctx.lineTo(obj.p1.x - par_x * arrow_size_par + per_x * arrow_size_per, obj.p1.y - par_y * arrow_size_par + per_y * arrow_size_per);
    ctx.lineTo(obj.p1.x - par_x * arrow_size_par - per_x * arrow_size_per, obj.p1.y - par_y * arrow_size_par - per_y * arrow_size_per);
    ctx.fill();

    //Draw arrow (p2)
    ctx.beginPath();
    ctx.moveTo(obj.p2.x - par_x * arrow_size_par, obj.p2.y - par_y * arrow_size_par);
    ctx.lineTo(obj.p2.x + par_x * arrow_size_par + per_x * arrow_size_per, obj.p2.y + par_y * arrow_size_par + per_y * arrow_size_per);
    ctx.lineTo(obj.p2.x + par_x * arrow_size_par - per_x * arrow_size_per, obj.p2.y + par_y * arrow_size_par - per_y * arrow_size_per);
    ctx.fill();
  }

  },



  //=============================When the object is shot by light================================
  shot: function(obj, ray, rayIndex, shootPoint) {
    //As an ideal lens combined with a plane mirror
    objTypes['lens'].shot(obj, ray, rayIndex, graphs.point(shootPoint.x, shootPoint.y));


    //Pull the light back
    ray.p1.x = 2 * ray.p1.x - ray.p2.x;
    ray.p1.y = 2 * ray.p1.y - ray.p2.y;



    objTypes['mirror'].shot(obj, ray, rayIndex, shootPoint);
  }





  };

  //"blackline"(Saga Line) Property
  objTypes['blackline'] = {

  //======================================Create object=========================================
  create: function(mouse) {
    return {type: 'blackline', p1: mouse, p2: mouse};
  },

  //Using the lineobj prototype
  c_mousedown: objTypes['lineobj'].c_mousedown,
  c_mousemove: objTypes['lineobj'].c_mousemove,
  c_mouseup: objTypes['lineobj'].c_mouseup,
  move: objTypes['lineobj'].move,
  clicked: objTypes['lineobj'].clicked,
  dragging: objTypes['lineobj'].dragging,
  rayIntersection: objTypes['lineobj'].rayIntersection,

  //=================================Draw objects onto the Canvas====================================
  draw: function(obj, canvas) {
  //var ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'rgb(70,35,10)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(obj.p1.x, obj.p1.y);
  ctx.lineTo(obj.p2.x, obj.p2.y);
  ctx.stroke();
  ctx.lineWidth = 1;
  },

  //=============================When the object is shot by light================================
  shot: function(obj, ray, rayIndex, rp) {
    ray.exist = false;
  }

  };

  //"radiant"Property
  objTypes['radiant'] = {

  p_name: 'Brightness', //Attribute name
  p_min: 0,
  p_max: 1,
  p_step: 0.01,

  //======================================Create object=========================================
  create: function(mouse) {
  return {type: 'radiant', x: mouse.x, y: mouse.y, p: 0.5};
  },

  //==============================Create object process mouse press=======================================
  c_mousedown: function(obj, mouse)
  {
    draw();
  },
  //==============================Create object process mouse movement=======================================
  c_mousemove: function(obj, mouse, ctrl, shift)
  {
    /*
    obj.x=mouse.x;
    obj.y=mouse.y;
    draw();
    */
  },
  //==============================Open the object process and release the mouse=======================================
  c_mouseup: function(obj, mouse)
  {
    isConstructing = false;
  },

  //=================================Draw objects onto the Canvas====================================
  draw: function(obj, canvas) {
  //var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillRect(obj.x - 2, obj.y - 2, 5, 5);

  },

  //=================================Pan object====================================
  move: function(obj, diffX, diffY) {
    obj.x = obj.x + diffX;
    obj.y = obj.y + diffY;
    return obj;
  },


  //==========================When the drawing area is pressed (the part where the object is pressed))===========================
  clicked: function(obj, mouse_nogrid, mouse, draggingPart) {
    if (mouseOnPoint(mouse_nogrid, obj))
    {
      draggingPart.part = 0;
      draggingPart.mouse0 = graphs.point(obj.x, obj.y);
      draggingPart.targetPoint = graphs.point(obj.x, obj.y);
      draggingPart.snapData = {};
      return true;
    }
    return false;
  },

  //=================================When dragging objects====================================
  dragging: function(obj, mouse, draggingPart, ctrl, shift) {
    if (shift)
    {
      var mouse_snapped = snapToDirection(mouse, draggingPart.mouse0, [{x: 1, y: 0},{x: 0, y: 1}], draggingPart.snapData);
    }
    else
    {
      var mouse_snapped = mouse;
      draggingPart.snapData = {}; //Release the original drag direction lock when releasing shift
    }

    obj.x = mouse_snapped.x;
    obj.y = mouse_snapped.y;
    return {obj: obj};
  },


  //=================================Emission light=============================================
  shoot: function(obj) {
  var s = Math.PI * 2 / parseInt(getRayDensity() * 500);
  var i0 = (mode == 'observer') ? (-s * 2 + 1e-6) : 0; //Black box appears to avoid the use of observers
  for (var i = i0; i < (Math.PI * 2 - 1e-5); i = i + s)
  {
    var ray1 = graphs.ray(graphs.point(obj.x, obj.y), graphs.point(obj.x + Math.sin(i), obj.y + Math.cos(i)));
    ray1.brightness = Math.min(obj.p / getRayDensity(), 1);
    ray1.isNew = true;
    if (i == i0)
    {
      ray1.gap = true;
    }
    addRay(ray1);
  }
  }




  };

  //"parallel"(Parallel light) Property
  objTypes['parallel'] = {

  p_name: 'Brightness', //Attribute name
  p_min: 0,
  p_max: 1,
  p_step: 0.01,

  //======================================Create object=========================================
  create: function(mouse) {
    return {type: 'parallel', p1: mouse, p2: mouse, p: 0.5};
  },

  //Using the lineobj prototype
  c_mousedown: objTypes['lineobj'].c_mousedown,
  c_mousemove: objTypes['lineobj'].c_mousemove,
  c_mouseup: objTypes['lineobj'].c_mouseup,
  move: objTypes['lineobj'].move,
  clicked: objTypes['lineobj'].clicked,
  dragging: objTypes['lineobj'].dragging,

  //=================================Draw objects onto the Canvas====================================
  draw: function(obj, canvas) {
    //var ctx = canvas.getContext('2d');
    var a_l = Math.atan2(obj.p1.x - obj.p2.x, obj.p1.y - obj.p2.y) - Math.PI / 2;
    ctx.strokeStyle = 'rgb(0,255,0)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(obj.p1.x + Math.sin(a_l) * 2, obj.p1.y + Math.cos(a_l) * 2);
    ctx.lineTo(obj.p2.x + Math.sin(a_l) * 2, obj.p2.y + Math.cos(a_l) * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(128,128,128,255)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(obj.p1.x, obj.p1.y);
    ctx.lineTo(obj.p2.x, obj.p2.y);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.lineCap = 'butt';
  },




  //=================================Emission light=============================================
  shoot: function(obj) {
    var n = graphs.length_segment(obj) * getRayDensity();
    var stepX = (obj.p2.x - obj.p1.x) / n;
    var stepY = (obj.p2.y - obj.p1.y) / n;
    var rayp2_x = obj.p1.x + obj.p2.y - obj.p1.y;
    var rayp2_y = obj.p1.y - obj.p2.x + obj.p1.x;


    for (var i = 0.5; i <= n; i++)
    {
      var ray1 = graphs.ray(graphs.point(obj.p1.x + i * stepX, obj.p1.y + i * stepY), graphs.point(rayp2_x + i * stepX, rayp2_y + i * stepY));
      ray1.brightness = Math.min(obj.p / getRayDensity(), 1);
      ray1.isNew = true;
      if (i == 0)
      {
        ray1.gap = true;
      }
      addRay(ray1);
    }

  }





  };

  //"arcmirror"(arc mirror) object
  objTypes['arcmirror'] = {

  //======================================Create object=========================================
  create: function(mouse) {
    return {type: 'arcmirror', p1: mouse};
  },

  //==============================Create object process mouse press=======================================
  c_mousedown: function(obj, mouse)
  {
    if (!obj.p2 && !obj.p3)
    {
      draw();
      obj.p2 = mouse;
      return;
    }
    if (obj.p2 && !obj.p3 && !mouseOnPoint_construct(mouse, obj.p1))
    {
      obj.p2 = mouse;
      draw();
      obj.p3 = mouse;
      return;
    }
  },
  //==============================Create object process mouse movement=======================================
  c_mousemove: function(obj, mouse, ctrl, shift)
  {
    if (!obj.p3 && !mouseOnPoint_construct(mouse, obj.p1))
    {
      if (shift)
      {
        obj.p2 = snapToDirection(mouse, constructionPoint, [{x: 1, y: 0},{x: 0, y: 1},{x: 1, y: 1},{x: 1, y: -1}]);
      }
      else
      {
        obj.p2 = mouse;
      }

      obj.p1 = ctrl ? graphs.point(2 * constructionPoint.x - obj.p2.x, 2 * constructionPoint.y - obj.p2.y) : constructionPoint;

      //obj.p2=mouse;
      draw();
      return;
    }
    if (obj.p3 && !mouseOnPoint_construct(mouse, obj.p2))
    {
      obj.p3 = mouse;
      draw();
      return;
    }
  },
  //==============================Open the object process and release the mouse=======================================
  c_mouseup: function(obj, mouse)
  {
    if (obj.p2 && !obj.p3 && !mouseOnPoint_construct(mouse, obj.p1))
    {
      obj.p3 = mouse;
      return;
    }
    if (obj.p3 && !mouseOnPoint_construct(mouse, obj.p2))
    {
      obj.p3 = mouse;
      draw();
      isConstructing = false;
      return;
    }
  },

  //=================================Draw objects onto the Canvas====================================
  draw: function(obj, canvas) {
    //var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(255,0,255)';
    //ctx.lineWidth=1.5;
    if (obj.p3 && obj.p2)
    {
      var center = graphs.intersection_2line(graphs.perpendicular_bisector(graphs.line(obj.p1, obj.p3)), graphs.perpendicular_bisector(graphs.line(obj.p2, obj.p3)));
      if (isFinite(center.x) && isFinite(center.y))
      {
        var r = graphs.length(center, obj.p3);
        var a1 = Math.atan2(obj.p1.y - center.y, obj.p1.x - center.x);
        var a2 = Math.atan2(obj.p2.y - center.y, obj.p2.x - center.x);
        var a3 = Math.atan2(obj.p3.y - center.y, obj.p3.x - center.x);
        ctx.strokeStyle = 'rgb(168,168,168)';
        ctx.beginPath();
        ctx.arc(center.x, center.y, r, a1, a2, (a2 < a3 && a3 < a1) || (a1 < a2 && a2 < a3) || (a3 < a1 && a1 < a2));
        ctx.stroke();
        ctx.fillRect(obj.p3.x - 2, obj.p3.y - 2, 3, 3);
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.fillRect(obj.p1.x - 2, obj.p1.y - 2, 3, 3);
        ctx.fillRect(obj.p2.x - 2, obj.p2.y - 2, 3, 3);
      }
      else
      {
        //Arc three points collinear, treated as line segments
        ctx.strokeStyle = 'rgb(168,168,168)';
        ctx.beginPath();
        ctx.moveTo(obj.p1.x, obj.p1.y);
        ctx.lineTo(obj.p2.x, obj.p2.y);
        ctx.stroke();

        ctx.fillRect(obj.p3.x - 2, obj.p3.y - 2, 3, 3);
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.fillRect(obj.p1.x - 2, obj.p1.y - 2, 3, 3);
        ctx.fillRect(obj.p2.x - 2, obj.p2.y - 2, 3, 3);
      }
    }
    else if (obj.p2)
    {
      ctx.fillStyle = 'rgb(255,0,0)';
      ctx.fillRect(obj.p1.x - 2, obj.p1.y - 2, 3, 3);
      ctx.fillRect(obj.p2.x - 2, obj.p2.y - 2, 3, 3);
    }
    else
    {
      ctx.fillStyle = 'rgb(255,0,0)';
      ctx.fillRect(obj.p1.x - 2, obj.p1.y - 2, 3, 3);
    }
    //ctx.lineWidth=1;
  },

  //=================================Pan object====================================
  move: function(obj, diffX, diffY) {
    //Move the first point of the line segment
    obj.p1.x = obj.p1.x + diffX;
    obj.p1.y = obj.p1.y + diffY;
    //Move the second point of the line segment
    obj.p2.x = obj.p2.x + diffX;
    obj.p2.y = obj.p2.y + diffY;

    obj.p3.x = obj.p3.x + diffX;
    obj.p3.y = obj.p3.y + diffY;
    return obj;
  },


  //==========================When the drawing area is pressed (the part where the object is pressed)===========================
  clicked: function(obj, mouse_nogrid, mouse, draggingPart) {
    if (mouseOnPoint(mouse_nogrid, obj.p1) && graphs.length_squared(mouse_nogrid, obj.p1) <= graphs.length_squared(mouse_nogrid, obj.p2) && graphs.length_squared(mouse_nogrid, obj.p1) <= graphs.length_squared(mouse_nogrid, obj.p3))
    {
      draggingPart.part = 1;
      draggingPart.targetPoint = graphs.point(obj.p1.x, obj.p1.y);
      return true;
    }
    if (mouseOnPoint(mouse_nogrid, obj.p2) && graphs.length_squared(mouse_nogrid, obj.p2) <= graphs.length_squared(mouse_nogrid, obj.p3))
    {
      draggingPart.part = 2;
      draggingPart.targetPoint = graphs.point(obj.p2.x, obj.p2.y);
      return true;
    }
    if (mouseOnPoint(mouse_nogrid, obj.p3))
    {
      draggingPart.part = 3;
      draggingPart.targetPoint = graphs.point(obj.p3.x, obj.p3.y);
      return true;
    }

    var center = graphs.intersection_2line(graphs.perpendicular_bisector(graphs.line(obj.p1, obj.p3)), graphs.perpendicular_bisector(graphs.line(obj.p2, obj.p3)));
    if (isFinite(center.x) && isFinite(center.y))
    {
      var r = graphs.length(center, obj.p3);
      var a1 = Math.atan2(obj.p1.y - center.y, obj.p1.x - center.x);
      var a2 = Math.atan2(obj.p2.y - center.y, obj.p2.x - center.x);
      var a3 = Math.atan2(obj.p3.y - center.y, obj.p3.x - center.x);
      var a_m = Math.atan2(mouse_nogrid.y - center.y, mouse_nogrid.x - center.x);
      if (Math.abs(graphs.length(center, mouse_nogrid) - r) < clickExtent_line && (((a2 < a3 && a3 < a1) || (a1 < a2 && a2 < a3) || (a3 < a1 && a1 < a2)) == ((a2 < a_m && a_m < a1) || (a1 < a2 && a2 < a_m) || (a_m < a1 && a1 < a2))))
      {
        //Drag the entire object
        draggingPart.part = 0;
        draggingPart.mouse0 = mouse; //The position of the mouse when you start dragging
        draggingPart.mouse1 = mouse; //The position of the mouse on the previous point when draggings
        draggingPart.snapData = {};
        return true;
      }
    }
    else
    {
      //Arc three points collinear, treated as line segments
      if (mouseOnSegment(mouse_nogrid, obj))
      {
        draggingPart.part = 0;
        draggingPart.mouse0 = mouse; //The position of the mouse when you start dragging
        draggingPart.mouse1 = mouse; //The position of the mouse on the previous point when dragging
        draggingPart.snapData = {};
        return true;
      }
    }
    return false;
  },

  //================================= when dragging objects====================================
  dragging: function(obj, mouse, draggingPart, ctrl, shift) {
    var basePoint;
    if (draggingPart.part == 1)
    {
      //Dragging the first endpoint
      basePoint = ctrl ? graphs.midpoint(draggingPart.originalObj) : draggingPart.originalObj.p2;

      obj.p1 = shift ? snapToDirection(mouse, basePoint, [{x: 1, y: 0},{x: 0, y: 1},{x: 1, y: 1},{x: 1, y: -1},{x: (draggingPart.originalObj.p2.x - draggingPart.originalObj.p1.x), y: (draggingPart.originalObj.p2.y - draggingPart.originalObj.p1.y)}]) : mouse;
      obj.p2 = ctrl ? graphs.point(2 * basePoint.x - obj.p1.x, 2 * basePoint.y - obj.p1.y) : basePoint;

      //obj.p1=mouse;
    }
    if (draggingPart.part == 2)
    {
      //Dragging the second endpoint

      basePoint = ctrl ? graphs.midpoint(draggingPart.originalObj) : draggingPart.originalObj.p1;

      obj.p2 = shift ? snapToDirection(mouse, basePoint, [{x: 1, y: 0},{x: 0, y: 1},{x: 1, y: 1},{x: 1, y: -1},{x: (draggingPart.originalObj.p2.x - draggingPart.originalObj.p1.x), y: (draggingPart.originalObj.p2.y - draggingPart.originalObj.p1.y)}]) : mouse;
      obj.p1 = ctrl ? graphs.point(2 * basePoint.x - obj.p2.x, 2 * basePoint.y - obj.p2.y) : basePoint;

      //obj.p2=mouse;
    }
    if (draggingPart.part == 3)
    {
      //Dragging arc control points
      obj.p3 = mouse;
    }

    if (draggingPart.part == 0)
    {
      //Dragging the entire object

      if (shift)
      {
        var mouse_snapped = snapToDirection(mouse, draggingPart.mouse0, [{x: 1, y: 0},{x: 0, y: 1},{x: (draggingPart.originalObj.p2.x - draggingPart.originalObj.p1.x), y: (draggingPart.originalObj.p2.y - draggingPart.originalObj.p1.y)},{x: (draggingPart.originalObj.p2.y - draggingPart.originalObj.p1.y), y: -(draggingPart.originalObj.p2.x - draggingPart.originalObj.p1.x)}], draggingPart.snapData);
      }
      else
      {
        var mouse_snapped = mouse;
        draggingPart.snapData = {}; //Release the original drag direction lock when releasing shift
      }

      var mouseDiffX = draggingPart.mouse1.x - mouse_snapped.x; //The current X position of the mouse position and the position of the last mouse position
      var mouseDiffY = draggingPart.mouse1.y - mouse_snapped.y; //The current Y position of the mouse position and the position of the last mouse position
      //Move the first point of the line segment
      obj.p1.x = obj.p1.x - mouseDiffX;
      obj.p1.y = obj.p1.y - mouseDiffY;
      //Move the second point of the line segment
      obj.p2.x = obj.p2.x - mouseDiffX;
      obj.p2.y = obj.p2.y - mouseDiffY;

      obj.p3.x = obj.p3.x - mouseDiffX;
      obj.p3.y = obj.p3.y - mouseDiffY;

      //Update mouse position
      draggingPart.mouse1 = mouse_snapped;
    }
  },



  //====================Determine if a light will hit the object (if it is, then pass back the intersection)====================
  rayIntersection: function(obj, ray) {
    if (!obj.p3) {return;}
    var center = graphs.intersection_2line(graphs.perpendicular_bisector(graphs.line(obj.p1, obj.p3)), graphs.perpendicular_bisector(graphs.line(obj.p2, obj.p3)));
    if (isFinite(center.x) && isFinite(center.y))
    {

      var rp_temp = graphs.intersection_line_circle(graphs.line(ray.p1, ray.p2), graphs.circle(center, obj.p2));   //The intersection of the light (extension line) and the mirror
      //canvasPainter.draw(rp_temp[1],canvas);
      //var a_rp
      var rp_exist = [];
      var rp_lensq = [];
      for (var i = 1; i <= 2; i++)
      {

        rp_exist[i] = !graphs.intersection_is_on_segment(graphs.intersection_2line(graphs.line(obj.p1, obj.p2), graphs.line(obj.p3, rp_temp[i])), graphs.segment(obj.p3, rp_temp[i])) && graphs.intersection_is_on_ray(rp_temp[i], ray) && graphs.length_squared(rp_temp[i], ray.p1) > minShotLength_squared;


        rp_lensq[i] = graphs.length_squared(ray.p1, rp_temp[i]); //The distance the light hits the i-th intersection
      }


      if (rp_exist[1] && ((!rp_exist[2]) || rp_lensq[1] < rp_lensq[2])) {return rp_temp[1];}
      if (rp_exist[2] && ((!rp_exist[1]) || rp_lensq[2] < rp_lensq[1])) {return rp_temp[2];}
    }
    else
    {
      //Arc three points collinear, treated as line segments
      return objTypes['mirror'].rayIntersection(obj, ray);
    }
    //alert("")
  },

  //=============================When the object is shot by light================================
  shot: function(obj, ray, rayIndex, rp) {

    //alert("")
    var center = graphs.intersection_2line(graphs.perpendicular_bisector(graphs.line(obj.p1, obj.p3)), graphs.perpendicular_bisector(graphs.line(obj.p2, obj.p3)));
    if (isFinite(center.x) && isFinite(center.y))
    {

      var rx = ray.p1.x - rp.x;
      var ry = ray.p1.y - rp.y;
      var cx = center.x - rp.x;
      var cy = center.y - rp.y;
      var c_sq = cx * cx + cy * cy;
      var r_dot_c = rx * cx + ry * cy;
      ray.p1 = rp;

      ray.p2 = graphs.point(rp.x - c_sq * rx + 2 * r_dot_c * cx, rp.y - c_sq * ry + 2 * r_dot_c * cy);
    }
    else
    {
      //Arc three points collinear, treated as line segments
      return objTypes['mirror'].shot(obj, ray, rayIndex, rp);
    }

  }





  };

  //"ruler"Property
  objTypes['ruler'] = {

  //======================================Create object=========================================
  create: function(mouse) {
    return {type: 'ruler', p1: mouse, p2: mouse};
  },

  //Using the lineobj prototype
  c_mousedown: objTypes['lineobj'].c_mousedown,
  c_mousemove: objTypes['lineobj'].c_mousemove,
  c_mouseup: objTypes['lineobj'].c_mouseup,
  move: objTypes['lineobj'].move,
  clicked: objTypes['lineobj'].clicked,
  dragging: objTypes['lineobj'].dragging,

  //=================================Draw objects onto the Canvas====================================
  draw: function(obj, canvas, aboveLight) {
  //var ctx = canvas.getContext('2d');
  if (aboveLight)return;
  ctx.globalCompositeOperation = 'lighter';
  var len = Math.sqrt((obj.p2.x - obj.p1.x) * (obj.p2.x - obj.p1.x) + (obj.p2.y - obj.p1.y) * (obj.p2.y - obj.p1.y));
  var par_x = (obj.p2.x - obj.p1.x) / len;
  var par_y = (obj.p2.y - obj.p1.y) / len;
  var per_x = par_y;
  var per_y = -par_x;
  var ang = Math.atan2(obj.p2.y - obj.p1.y, obj.p2.x - obj.p1.x);
  //console.log(ang);

  var scale_step = 10;
  var scale_step_mid = 50;
  var scale_step_long = 100;
  var scale_len = 10;
  var scale_len_mid = 15;
  //var scale_len_long=20;


  ctx.strokeStyle = 'rgb(128,128,128)';
  //ctx.font="bold 14px Arial";
  ctx.font = '14px Arial';
  ctx.fillStyle = 'rgb(128,128,128)';

  if (ang > Math.PI * (-0.25) && ang <= Math.PI * 0.25)
  {
    //↘~↗
    //console.log("↘~↗");
    var scale_direction = -1;
    var scale_len_long = 20;
    var text_ang = ang;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
  }
  else if (ang > Math.PI * (-0.75) && ang <= Math.PI * (-0.25))
  {
    //↗~↖
    //console.log("↗~↖");
    var scale_direction = 1;
    var scale_len_long = 15;
    var text_ang = ang - Math.PI * (-0.5);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
  }
  else if (ang > Math.PI * 0.75 || ang <= Math.PI * (-0.75))
  {
    //↖~↙
    //console.log("↖~↙");
    var scale_direction = 1;
    var scale_len_long = 20;
    var text_ang = ang - Math.PI;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
  }
  else
  {
    //↙~↘
    //console.log("↙~↘");
    var scale_direction = -1;
    var scale_len_long = 15;
    var text_ang = ang - Math.PI * 0.5;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
  }

  //ctx.textBaseline="hanging";
  //ctx.lineWidth=3;
  //ctx.lineCap = "butt";
  ctx.beginPath();
  ctx.moveTo(obj.p1.x, obj.p1.y);
  ctx.lineTo(obj.p2.x, obj.p2.y);
  //ctx.stroke();
  //ctx.lineWidth=1;
  var x, y;
  for (var i = 0; i <= len; i += scale_step)
  {
    ctx.moveTo(obj.p1.x + i * par_x, obj.p1.y + i * par_y);
    if (i % scale_step_long == 0)
    {
      x = obj.p1.x + i * par_x + scale_direction * scale_len_long * per_x;
      y = obj.p1.y + i * par_y + scale_direction * scale_len_long * per_y;
      ctx.lineTo(x, y);
      //ctx.stroke();
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(text_ang);
      ctx.fillText(i, 0, 0);
      ctx.restore();
    }
    else if (i % scale_step_mid == 0)
    {
      ctx.lineTo(obj.p1.x + i * par_x + scale_direction * scale_len_mid * per_x, obj.p1.y + i * par_y + scale_direction * scale_len_mid * per_y);
      //ctx.stroke();
    }
    else
    {
      ctx.lineTo(obj.p1.x + i * par_x + scale_direction * scale_len * per_x, obj.p1.y + i * par_y + scale_direction * scale_len * per_y);
      //ctx.stroke();
    }
  }
  ctx.stroke();
  //ctx.stroke();

  ctx.globalCompositeOperation = 'source-over';
  }

  };

  //"protractor"Property
  objTypes['protractor'] = {

  //======================================Create object=========================================
  create: function(mouse) {
    return {type: 'protractor', p1: mouse, p2: mouse};
  },

  //Using the lineobj prototype
  c_mousedown: objTypes['lineobj'].c_mousedown,
  c_mousemove: function(obj, mouse, ctrl, shift) {objTypes['lineobj'].c_mousemove(obj, mouse, false, shift)},
  c_mouseup: objTypes['lineobj'].c_mouseup,
  move: objTypes['lineobj'].move,

  //==========================When the drawing area is pressed (the part where the object is pressed)===========================
  clicked: function(obj, mouse_nogrid, mouse, draggingPart) {
    if (mouseOnPoint(mouse_nogrid, obj.p1) && graphs.length_squared(mouse_nogrid, obj.p1) <= graphs.length_squared(mouse_nogrid, obj.p2))
    {
      draggingPart.part = 1;
      draggingPart.targetPoint = graphs.point(obj.p1.x, obj.p1.y);
      return true;
    }
    if (mouseOnPoint(mouse_nogrid, obj.p2))
    {
      draggingPart.part = 2;
      draggingPart.targetPoint = graphs.point(obj.p2.x, obj.p2.y);
      return true;
    }
    if (Math.abs(graphs.length(obj.p1, mouse_nogrid) - graphs.length_segment(obj)) < clickExtent_line)
    {
      draggingPart.part = 0;
      draggingPart.mouse0 = mouse; //The position of the mouse when you start dragging
      draggingPart.mouse1 = mouse; //The position of the mouse on the previous point when dragging
      draggingPart.snapData = {};
      return true;
    }
    return false;
  },

  //=================================When dragging objects====================================
  dragging: function(obj, mouse, draggingPart, ctrl, shift) {objTypes['lineobj'].dragging(obj, mouse, draggingPart, false, shift)},

  //=================================Draw objects to Canvas上====================================
  draw: function(obj, canvas, aboveLight) {
  //var ctx = canvas.getContext('2d');
  if (!aboveLight)
  {
    ctx.globalCompositeOperation = 'lighter';
    var r = Math.sqrt((obj.p2.x - obj.p1.x) * (obj.p2.x - obj.p1.x) + (obj.p2.y - obj.p1.y) * (obj.p2.y - obj.p1.y));
    var scale_width_limit = 5;

    var scale_step = 1;
    var scale_step_mid = 5;
    var scale_step_long = 10;
    var scale_len = 10;
    var scale_len_mid = 15;
    var scale_len_long = 20;

    ctx.strokeStyle = 'rgb(128,128,128)';
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = 'rgb(128,128,128)';

    if (r * scale_step * Math.PI / 180 < scale_width_limit)
    {
      //The scale is too small
      scale_step = 2;
      scale_step_mid = 10;
      scale_step_long = 30;
    }
    if (r * scale_step * Math.PI / 180 < scale_width_limit)
    {
      //The scale is too small
      scale_step = 5;
      scale_step_mid = 10;
      scale_step_long = 30;
      scale_len = 5;
      scale_len_mid = 8;
      scale_len_long = 10;
      ctx.font = 'bold 10px Arial';
    }
    if (r * scale_step * Math.PI / 180 < scale_width_limit)
    {
      //The scale is too small
      scale_step = 10;
      scale_step_mid = 30;
      scale_step_long = 90;
    }


    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    ctx.beginPath();
    ctx.arc(obj.p1.x, obj.p1.y, r, 0, Math.PI * 2, false);
    //ctx.stroke();

    var ang, x, y;
    for (var i = 0; i < 360; i += scale_step)
    {
      ang = i * Math.PI / 180 + Math.atan2(obj.p2.y - obj.p1.y, obj.p2.x - obj.p1.x);
      ctx.moveTo(obj.p1.x + r * Math.cos(ang), obj.p1.y + r * Math.sin(ang));
      if (i % scale_step_long == 0)
      {
        x = obj.p1.x + (r - scale_len_long) * Math.cos(ang);
        y = obj.p1.y + (r - scale_len_long) * Math.sin(ang);
        ctx.lineTo(x, y);
        //ctx.stroke();
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang + Math.PI * 0.5);
        ctx.fillText((i > 180) ? (360 - i) : i, 0, 0);
        ctx.restore();
      }
      else if (i % scale_step_mid == 0)
      {
        ctx.lineTo(obj.p1.x + (r - scale_len_mid) * Math.cos(ang), obj.p1.y + (r - scale_len_mid) * Math.sin(ang));
        //ctx.stroke();
      }
      else
      {
        ctx.lineTo(obj.p1.x + (r - scale_len) * Math.cos(ang), obj.p1.y + (r - scale_len) * Math.sin(ang));
        //ctx.stroke();
      }
    }
    ctx.stroke();
    //ctx.stroke();

    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.fillStyle = 'red';
  ctx.fillRect(obj.p1.x - 2, obj.p1.y - 2, 3, 3);
  ctx.fillStyle = 'rgb(255,0,255)';
  //ctx.fillStyle="indigo";
  ctx.fillRect(obj.p2.x - 2, obj.p2.y - 2, 3, 3);

  }

  };



  var canvas;
  var ctx;
  var mouse; //Mouse position
  var mouse_lastmousedown; //The position of the mouse when the mouse was last pressed
  var objs = []; //Property
  var objCount = 0; //Number of objects
  var isConstructing = false; //Creating new object
  var constructionPoint; //Create the starting position of the object
  var draggingObj = -1; //The item number in the drag (-1 means no drag, -3 means the whole picture, -4 means the observer)
  var positioningObj = -1; //Enter the object number in the coordinates (-1 means no, -4 means observer)
  var draggingPart = {}; //Dragged part and mouse position information
  var selectedObj = -1; //Selected object number (-1 means no selection)
  var AddingObjType = ''; //Drag the type of new object in the blank space
  var waitingRays = []; //Pending light
  var waitingRayCount = 0; //Number of light to be processed
  var rayDensity_light = 0.1; //Light density (light related mode)
  var rayDensity_images = 1; //Light density (like correlation mode)
  var extendLight = false; //Observer image
  var showLight = true; //Display light
  var gridSize = 20; //Grid size
  var origin = {x: 0, y: 0}; //Grid origin coordinate
  var undoArr = []; //Restoration data
  var undoIndex = 0; //Current recovery location
  var undoLimit = 20; //Maximum number of recovery steps
  var undoUBound = 0; //Current restoration data upper bound
  var undoLBound = 0; //Current reduction of data
  var observer;
  var mode = 'light';
  var timerID = -1;
  var isDrawing = false;
  var hasExceededTime = false;
  var forceStop = false;
  var lastDrawTime = -1;
  var stateOutdated = false; //The status has changed since the last drawing
  var minShotLength = 1e-6; //The shortest distance the light acts twice (light effects below this distance are ignored)
  var minShotLength_squared = minShotLength * minShotLength;
  var snapToDirection_lockLimit_squared = 900; //The square of the drag distance required to drag the object and lock the direction of adsorption when using the Snap to Direction function
  var clickExtent_line = 10;
  var clickExtent_point = 10;
  var clickExtent_point_construct = 10;
  var tools_normal = ['laser', 'radiant', 'parallel', 'blackline', 'ruler', 'protractor', ''];
  var tools_withList = ['mirror_', 'refractor_'];
  var tools_inList = ['mirror', 'arcmirror', 'idealmirror', 'lens', 'refractor', 'halfplane', 'circlelens'];
  var modes = ['light', 'extended_light', 'images', 'observer'];
  var xyBox_cancelContextMenu = false;
  var scale = 1;

  window.onload = function(e) {
    init_i18n();
    canvas = document.getElementById('canvas1');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');



    mouse = graphs.point(0, 0);
    //mode=document.getElementById("mode").value;
    //observer=graphs.circle(graphs.point(canvas.width*0.5,canvas.height*0.5),20);
    //document.getElementById('objAttr_text').value="";
    //toolbtn_clicked(AddingObjType);

    if (typeof(Storage) !== "undefined" && localStorage.rayOpticsData) {
      document.getElementById('textarea1').value = localStorage.rayOpticsData;
    }

    if (document.getElementById('textarea1').value != '')
    {
      JSONInput();
      toolbtn_clicked('');
    }
    else
    {
      initParameters();
    }
    undoArr[0] = document.getElementById('textarea1').value;
    document.getElementById('undo').disabled = true;
    document.getElementById('redo').disabled = true;

    window.onmousedown = function(e)
    {
      selectObj(-1);
    };
    window.ontouchstart = function(e)
    {
      selectObj(-1);
    };


    canvas.onmousedown = function(e)
    {
      document.getElementById('objAttr_text').blur();
      document.body.focus();
      canvas_onmousedown(e);
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
      return false;
    };

    canvas.onmousemove = function(e)
    {
      canvas_onmousemove(e);
    };

    canvas.onmouseup = function(e)
    {
      canvas_onmouseup(e);
    };

    // IE9, Chrome, Safari, Opera
    canvas.addEventListener("mousewheel", canvas_onmousewheel, false);
    // Firefox
    canvas.addEventListener("DOMMouseScroll", canvas_onmousewheel, false);

    function canvas_onmousewheel(e) {
      // cross-browser wheel delta
      var e = window.event || e; // old IE support
      var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      var d = scale;
      if (delta < 0) {
        d = scale * 0.9;
      } else if (delta > 0) {
        d = scale / 0.9;
      }
      d = Math.max(25, Math.min(500, d * 100));
      setScaleWithCenter(d / 100, (e.pageX - e.target.offsetLeft) / scale, (e.pageY - e.target.offsetTop) / scale);
      window.toolBarViewModel.zoom.value(d);
      return false;
    }

    canvas.ontouchstart = function(e)
    {
      document.getElementById('objAttr_text').blur();
      document.body.focus();
      canvas_onmousedown(e);
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
    };

    canvas.ontouchmove = function(e)
    {
      canvas_onmousemove(e);
      e.preventDefault();
    };

    canvas.ontouchend = function(e)
    {
      canvas_onmouseup(e);
      e.preventDefault();
    };

    canvas.ontouchcancel = function(e)
    {
      canvas_onmouseup(e);
      undo();
      e.preventDefault();
    };

    canvas.ondblclick = function(e)
    {
      canvas_ondblclick(e);
    };


    tools_normal.forEach(function(element, index)
    {
      document.getElementById('tool_' + element).onmouseenter = function(e) {toolbtn_mouseentered(element, e);};
      document.getElementById('tool_' + element).onclick = function(e) {toolbtn_clicked(element, e);};
      cancelMousedownEvent('tool_' + element);
    });

    tools_withList.forEach(function(element, index)
    {
      document.getElementById('tool_' + element).onmouseenter = function(e) {toolbtnwithlist_mouseentered(element, e);};
      /*document.getElementById('tool_' + element).onclick = function(e) {toolbtnwithlist_mouseentered(element, e);};*/
      document.getElementById('tool_' + element).onclick = function(e) {toolbtn_clicked(element, e);};
      document.getElementById('tool_' + element).onmouseleave = function(e) {toolbtnwithlist_mouseleft(element, e);};
      document.getElementById('tool_' + element + 'list').onmouseleave = function(e) {toollist_mouseleft(element, e);};
      cancelMousedownEvent('tool_' + element);
    });

    tools_inList.forEach(function(element, index)
    {
      document.getElementById('tool_' + element).onclick = function(e) {toollistbtn_clicked(element, e);};
      cancelMousedownEvent('tool_' + element);
    });


    document.getElementById('undo').onclick = undo;
    cancelMousedownEvent('undo');
    document.getElementById('redo').onclick = redo;
    cancelMousedownEvent('redo');
    document.getElementById('reset').onclick = function() {initParameters();createUndoPoint();};
    cancelMousedownEvent('reset');
    document.getElementById('accessJSON').onclick = accessJSON;
    cancelMousedownEvent('accessJSON');
    document.getElementById('save').onclick = function()
    {
      document.getElementById('saveBox').style.display = '';
      document.getElementById('save_name').select();
    };
    cancelMousedownEvent('save');
    document.getElementById('open').onclick = function()
    {
      document.getElementById('openfile').click();
    };
    cancelMousedownEvent('open');

    document.getElementById('openfile').onchange = function()
    {
      open(this.files[0]);
    };

    modes.forEach(function(element, index)
    {
    document.getElementById('mode_' + element).onclick = function() {
      modebtn_clicked(element);
      createUndoPoint();
    };
    cancelMousedownEvent('mode_' + element);
    });
    document.getElementById('zoom').oninput = function()
    {
      setScale(this.value / 100);
      draw();
    };
    document.getElementById('zoom_txt').onfocusout = function()
    {
      setScale(this.value / 100);
      draw();
    };
    document.getElementById('zoom_txt').onkeyup = function()
    {
      if (event.keyCode === 13) {
        setScale(this.value / 100);
        draw();
      }
    };
    document.getElementById('zoom').onmouseup = function()
    {
      setScale(this.value / 100); //In order to make browsers that do not support on input available
      createUndoPoint();
    };
    document.getElementById('zoom').ontouchend = function()
    {
      setScale(this.value / 100); //In order to make browsers that do not support on input available
      createUndoPoint();
    };
    cancelMousedownEvent('rayDensity');
    document.getElementById('rayDensity').oninput = function()
    {
      setRayDensity(Math.exp(this.value));
      draw();
    };
    document.getElementById('rayDensity_txt').onfocusout = function()
    {
      setRayDensity(Math.exp(this.value));
      draw();
    };
    document.getElementById('rayDensity_txt').onkeyup = function()
    {
      if (event.keyCode === 13) {
        setRayDensity(Math.exp(this.value));
        draw();
      }
    };
    document.getElementById('rayDensity').onmouseup = function()
    {
      setRayDensity(Math.exp(this.value)); //In order to make browsers that do not support oninput available
      draw();
      createUndoPoint();
    };
    document.getElementById('rayDensity').ontouchend = function()
    {
      setRayDensity(Math.exp(this.value)); //In order to make browsers that do not support oninput available
      draw();
      createUndoPoint();
    };
    cancelMousedownEvent('rayDensity');
    cancelMousedownEvent('lockobjs_');
    cancelMousedownEvent('grid_');
    document.getElementById('showgrid_').onclick = function() {draw()};
    document.getElementById('showgrid').onclick = function() {draw()};
    cancelMousedownEvent('showgrid_');

    document.getElementById('forceStop').onclick = function()
    {
      if (timerID != -1)
      {
        forceStop = true;
      }
    };
    cancelMousedownEvent('forceStop');
    document.getElementById('objAttr_range').oninput = function()
    {
      setAttr(document.getElementById('objAttr_range').value * 1);
    };

    document.getElementById('objAttr_range').onmouseup = function()
    {
      createUndoPoint();
    };

    document.getElementById('objAttr_range').ontouchend = function()
    {
      setAttr(document.getElementById('objAttr_range').value * 1);
      createUndoPoint();
    };
    cancelMousedownEvent('objAttr_range');
    document.getElementById('objAttr_text').onchange = function()
    {
      setAttr(document.getElementById('objAttr_text').value * 1);
    };
    cancelMousedownEvent('objAttr_text');
    document.getElementById('objAttr_text').onkeydown = function(e)
    {
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
    };
    document.getElementById('objAttr_text').onclick = function(e)
    {
      this.select();
    };
    document.getElementById('setAttrAll').onchange = function()
    {
      setAttr(document.getElementById('objAttr_text').value * 1);
      createUndoPoint();
    };
    cancelMousedownEvent('setAttrAll');
    cancelMousedownEvent('setAttrAll_');

    document.getElementById('copy').onclick = function()
    {
      objs[objs.length] = JSON.parse(JSON.stringify(objs[selectedObj]));
      draw();
      createUndoPoint();
    };
    cancelMousedownEvent('copy');
    document.getElementById('delete').onclick = function()
    {
      removeObj(selectedObj);
      draw();
      createUndoPoint();
    };
    cancelMousedownEvent('delete');
    document.getElementById('textarea1').onchange = function()
    {
      JSONInput();
      createUndoPoint();
    };



    document.getElementById('save_name').onkeydown = function(e)
    {
      //console.log(e.keyCode)
      if (e.keyCode == 13)
      {
        //enter
        document.getElementById('save_confirm').onclick();
      }
      if (e.keyCode == 27)
      {
        //esc
        document.getElementById('save_cancel').onclick();
      }

      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
    };
    document.getElementById('save_cancel').onclick = function()
    {
      document.getElementById('saveBox').style.display = 'none';
    };
    document.getElementById('save_confirm').onclick = save;

    cancelMousedownEvent('saveBox');


    document.getElementById('xybox').onkeydown = function(e)
    {
      //console.log(e.keyCode)
      if (e.keyCode == 13)
      {
        //enter
        confirmPositioning(e.ctrlKey, e.shiftKey);
      }
      if (e.keyCode == 27)
      {
        //esc
        endPositioning();
      }

      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
    };

    document.getElementById('xybox').oninput = function(e)
    {
      this.size = this.value.length;
    };

    document.getElementById('xybox').addEventListener('contextmenu', function(e) {
      if (xyBox_cancelContextMenu)
      {
         e.preventDefault();
         xyBox_cancelContextMenu = false;
      }
        }, false);

    cancelMousedownEvent('xybox');


    window.ondragenter = function(e)
    {
      e.stopPropagation();
      e.preventDefault();
    };

    window.ondragover = function(e)
    {
      e.stopPropagation();
      e.preventDefault();
    };

    window.ondrop = function(e)
    {
      e.stopPropagation();
      e.preventDefault();

      var dt = e.dataTransfer;
      if (dt.files[0])
      {
        var files = dt.files;
        open(files[0]);
      }
      else
      {
        var fileString = dt.getData('text');
        document.getElementById('textarea1').value = fileString;
        selectedObj = -1;
        JSONInput();
        createUndoPoint();
      }
    };

    canvas.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        }, false);

    toolbtn_clicked('laser');
  };


  //========================Draw objects=================================

  function draw()
  {
    stateOutdated = true;
    document.getElementById('forceStop').style.display = 'none';
    if (timerID != -1)
    {
      //Stop processing if the program is processing the last drawing
      clearTimeout(timerID);
      timerID = -1;
      isDrawing = false;
    }

    if (!isDrawing)
    {
      isDrawing = true;
      draw_();
    }
  }


  function draw_() {
    if (!stateOutdated)
    {
      isDrawing = false;
      return;
    }
    stateOutdated = false;

    JSONOutput();
    canvasPainter.cls(); //Empty Canvas
    ctx.globalAlpha = 1;
    hasExceededTime = false;
    waitingRays = []; //Empty waiting area
    shotRayCount = 0;



    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    if (document.getElementById('showgrid').checked)
    {
      //Draw a grid
      //ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgb(64,64,64)';
      var dashstep = 4;
      ctx.beginPath();
      for (var x = origin.x / scale % gridSize; x <= canvas.width / scale; x += gridSize)
      {
        for (var y = 0; y <= canvas.height / scale; y += dashstep)
        {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + dashstep * 0.5);
        }
      }
      for (var y = origin.y / scale % gridSize; y <= canvas.height / scale; y += gridSize)
      {
        for (var x = 0; x <= canvas.width / scale; x += dashstep)
        {
          ctx.moveTo(x, y);
          ctx.lineTo(x + dashstep * 0.5, y);
        }
      }
      ctx.stroke();
    }
    ctx.restore();


    //Draw objects
    for (var i = 0; i < objs.length; i++)
    {
      objTypes[objs[i].type].draw(objs[i], canvas); //Draw objs[i]
      if (objTypes[objs[i].type].shoot)
      {
        objTypes[objs[i].type].shoot(objs[i]); //If objs[i] can emit light, let it shoot
      }
    }
    shootWaitingRays();
    if (mode == 'observer')
    {
      //Draw an instant observer
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.fillStyle = 'blue';
      ctx.arc(observer.c.x, observer.c.y, observer.r, 0, Math.PI * 2, false);
      ctx.fill();
    }
    lastDrawTime = new Date();
    //ctx.setTransform(1,0,0,1,0,0);
  }



  //////////////////////////////////////////////////////////////////////////////////////////////////////
  //========================================Light processing area==================================================
  //////////////////////////////////////////////////////////////////////////////////////////////////////

  //====================Put a light into the waiting area=========================
  function addRay(ray) {
    waitingRays[waitingRays.length] = ray;
  }

  //==================Get the current mode of light density ======================
  function getRayDensity()
  {
    if (mode == 'images' || mode == 'observer')
    {
      return rayDensity_images;
    }
    else
    {
      return rayDensity_light;
    }
  }


  //====================Shooting light from the waiting area=========================
  function shootWaitingRays() {
    timerID = -1;
    var st_time = new Date();
    //var instantObserver=mode=="observer";
    var alpha0 = 1;
    //var alpha0=document.getElementById("lightAlpha").value;
    ctx.globalAlpha = alpha0;
    //canvas.getContext('2d').lineWidth = 2;
    var ray1;
    var observed;
    var last_ray;
    var last_intersection;
    var s_obj;
    var s_obj_index;
    var last_s_obj_index;
    var s_point;
    var s_point_temp;
    //var s_len;
    var s_lensq;
    var s_lensq_temp;
    var observed_point;
    var observed_intersection;
    var rpd;
    var leftRayCount = waitingRays.length;
    var surfaceMerging_objs = [];

    //ctx.beginPath();
    while (leftRayCount != 0 && !forceStop)
    {
      if (new Date() - st_time > 200)
      {
        //If calculated has exceeded 200ms
        //Take a break for 10ms before continuing (to prevent the program from responding)
        document.getElementById('status').innerHTML = shotRayCount + ' rays (' + leftRayCount + ' waiting)'; //Display state
        hasExceededTime = true;
        timerID = setTimeout(shootWaitingRays, 10); //10ms Then come back to this function
        document.getElementById('forceStop').style.display = '';
        //console.log(timerID)
        return; //Jump out of this function
      }

      leftRayCount = 0; //Start calculating the amount of remaining light again
      last_s_obj_index = -1;
      last_ray = null;
      last_intersection = null;
      for (var j = 0; j < waitingRays.length; j++)
      {
        if (waitingRays[j] && waitingRays[j].exist)
        {
          //If waitingRays[j] exists
          //Start shooting waitingRays[j] (the last light in the waiting area)
          //Determine which object will be hit first when this light is shot.

          //↓ Search for each &quot;object that intersects this light&quot; and look for &quot;[the intersection of the object and the light] the object closest to [the head of the light]&quot;
          s_obj = null; //&quot;So far, the object closest to [the head of the light] in the object that has been inspected] is the object closest to [the head of the light]&quot;
          s_obj_index = -1;
          s_point = null;  //s_obj Intersection with light
          surfaceMerging_objs = []; //Object to be interfaced with the object being shot
          //surfaceMerging_obj_index=-1;
          //s_len=Infinity;
          s_lensq = Infinity; //Set the squared distance between [[s_obj intersection with light] and [head of light] to infinity (because no objects have been checked yet, but now to find the minimum)
          observed = false; //waitingRays[j] Whether it is seen by the observer
          for (var i = 0; i < objs.length; i++)
          {
            //↓If objs[i] will affect the light
            if (objTypes[objs[i].type].rayIntersection) {
              //↓ Determine if objs[i] intersects this light
              s_point_temp = objTypes[objs[i].type].rayIntersection(objs[i], waitingRays[j]);
              if (s_point_temp)
              {
                //At this time, objs[i] is &quot;the object that intersects this light&quot;, and the intersection point is s_point_temp
                s_lensq_temp = graphs.length_squared(waitingRays[j].p1, s_point_temp); //The distance from the intersection to the [head of the light]
                if (s_point && graphs.length_squared(s_point_temp, s_point) < minShotLength_squared && (objTypes[objs[i].type].supportSurfaceMerging || objTypes[s_obj.type].supportSurfaceMerging))
                {
                  //This light hits two objects at the same time, and at least one support interface fusion

                  if (objTypes[s_obj.type].supportSurfaceMerging)
                  {
                    if (objTypes[objs[i].type].supportSurfaceMerging)
                    {
                      //Both support interface fusion (eg two refractors connected by one edge)
                      surfaceMerging_objs[surfaceMerging_objs.length] = objs[i];
                    }
                    else
                    {
                      //Only the first interface support interface fusion
                      //The object to be shot is set to not support the interface fusion (if the boundary of the refractor coincides with a light shielding film, only the action of the light shielding film is performed)
                      s_obj = objs[i];
                      s_obj_index = i;
                      s_point = s_point_temp;
                      s_lensq = s_lensq_temp;

                      surfaceMerging_objs = [];
                    }
                  }
                }
                else if (s_lensq_temp < s_lensq && s_lensq_temp > minShotLength_squared)
                {
                  //↑If the distance between [[objs[i] and the intersection of the light] and the [head of the light] is &quot;the ratio&quot; so far, the object in the checked object [the intersection with the light] is closest to the [head of the light] Object is still short

                  s_obj = objs[i]; //Update &quot;So far, the object in the checked object [the intersection of the object and the light] is closest to the [head of the light]&quot;
                  s_obj_index = i;
                  s_point = s_point_temp; //s_point Also updated together
                  s_lensq = s_lensq_temp; //s_len Also updated together

                  surfaceMerging_objs = [];
                }
              }
            }
          }
          ctx.globalAlpha = alpha0 * waitingRays[j].brightness;
          //↓If the light does not hit any object
          if (s_lensq == Infinity)
          {
            if (mode == 'light' || mode == 'extended_light')
            {
              canvasPainter.draw(waitingRays[j], 'rgb(255,255,128)'); //Draw this light
              //if(waitingRays[j].gap)canvasPainter.draw(waitingRays[j],canvas,"rgb(0,0,255)");
            }
            if (mode == 'extended_light' && !waitingRays[j].isNew)
            {
              canvasPainter.draw(graphs.ray(waitingRays[j].p1, graphs.point(waitingRays[j].p1.x * 2 - waitingRays[j].p2.x, waitingRays[j].p1.y * 2 - waitingRays[j].p2.y)), 'rgb(255,128,0)'); //Draw an extension of this light
            }

            if (mode == 'observer')
            {
              //Use instant viewers
              observed_point = graphs.intersection_line_circle(waitingRays[j], observer)[2];
              if (observed_point)
              {
                if (graphs.intersection_is_on_ray(observed_point, waitingRays[j]))
                {
                  observed = true;
                }
              }
            }

            //waitingRays[j]=null  //Remove this light from the waiting area
            //This light has been shot at infinity and does not need to be processed.
          }
          else
          {
            //At this point, the representative light will hit s_obj (object) at s_point (position) after the s_len (distance) is emitted.
            if (mode == 'light' || mode == 'extended_light')
            {
              canvasPainter.draw(graphs.segment(waitingRays[j].p1, s_point), 'rgb(255,255,128)'); //Draw this light
              //if(waitingRays[j].gap)canvasPainter.draw(graphs.segment(waitingRays[j].p1,s_point),canvas,"rgb(0,0,255)");
            }
            if (mode == 'extended_light' && !waitingRays[j].isNew)
            {
              canvasPainter.draw(graphs.ray(waitingRays[j].p1, graphs.point(waitingRays[j].p1.x * 2 - waitingRays[j].p2.x, waitingRays[j].p1.y * 2 - waitingRays[j].p2.y)), 'rgb(255,128,0)'); //Draw an extension of this light
              canvasPainter.draw(graphs.ray(s_point, graphs.point(s_point.x * 2 - waitingRays[j].p1.x, s_point.y * 2 - waitingRays[j].p1.y)), 'rgb(80,80,80)'); //Draw this light forward extension

            }

            if (mode == 'observer')
            {
              //Use instant viewers
              observed_point = graphs.intersection_line_circle(waitingRays[j], observer)[2];

              if (observed_point)
              {

                if (graphs.intersection_is_on_segment(observed_point, graphs.segment(waitingRays[j].p1, s_point)))
                {
                  observed = true;
                }
              }
            }


          }
          if (mode == 'observer' && last_ray)
          {
            //Mode: Instant observer
            if (!waitingRays[j].gap)
            {
              observed_intersection = graphs.intersection_2line(waitingRays[j], last_ray); //Observed intersection of light

              if (observed)
              {
                if (last_intersection && graphs.length_squared(last_intersection, observed_intersection) < 25)
                {
                  //When the intersections are fairly close to each other
                  if (graphs.intersection_is_on_ray(observed_intersection, graphs.ray(observed_point, waitingRays[j].p1)) && graphs.length_squared(observed_point, waitingRays[j].p1) > 1e-5)
                  {

                    ctx.globalAlpha = alpha0 * (waitingRays[j].brightness + last_ray.brightness) * 0.5;
                    if (s_point)
                    {
                      rpd = (observed_intersection.x - waitingRays[j].p1.x) * (s_point.x - waitingRays[j].p1.x) + (observed_intersection.y - waitingRays[j].p1.y) * (s_point.y - waitingRays[j].p1.y);
                      //(observed_intersection-waitingRays[j].p1)與(s_point-waitingRays[j].p1) Inner product
                    }
                    else
                    {
                      rpd = (observed_intersection.x - waitingRays[j].p1.x) * (waitingRays[j].p2.x - waitingRays[j].p1.x) + (observed_intersection.y - waitingRays[j].p1.y) * (waitingRays[j].p2.y - waitingRays[j].p1.y);
                      //(observed_intersection-waitingRays[j].p1)與(waitingRays[j].p2-waitingRays[j].p1)Inner product
                    }
                    if (rpd < 0)
                    {
                      //Virtual image
                      canvasPainter.draw(observed_intersection, 'rgb(255,128,0)'); //Draw something like
                    }
                    else if (rpd < s_lensq)
                    {
                      //Real image
                      canvasPainter.draw(observed_intersection, 'rgb(255,255,128)'); //Draw something like
                    }
                    canvasPainter.draw(graphs.segment(observed_point, observed_intersection), 'rgb(0,0,255)'); //Draw a connection
                  }
                  else
                  {
                    canvasPainter.draw(graphs.ray(observed_point, waitingRays[j].p1), 'rgb(0,0,255)'); //Draw the observed light (ray)
                  }
                }
                else //if(last_intersection && (last_intersection.x*last_intersection.x+last_intersection.y*last_intersection.y>100))
                {
                  if (last_intersection)
                  {
                    canvasPainter.draw(graphs.ray(observed_point, waitingRays[j].p1), 'rgb(0,0,255)'); //Draw the observed light (ray)
                  }
                  /*
                  else
                  {
                    canvasPainter.draw(graphs.ray(observed_point,waitingRays[j].p1),canvas,"rgb(255,0,0)");
                  }
                  */
                }
              }
              last_intersection = observed_intersection;
            }
            else
            {
              last_intersection = null;
            }
          }

          if (mode == 'images' && last_ray)
          {
            //Mode: like
            if (!waitingRays[j].gap)
            {

              observed_intersection = graphs.intersection_2line(waitingRays[j], last_ray);
              if (last_intersection && graphs.length_squared(last_intersection, observed_intersection) < 25)
              {
                ctx.globalAlpha = alpha0 * (waitingRays[j].brightness + last_ray.brightness) * 0.5;

                if (s_point)
                {
                  rpd = (observed_intersection.x - waitingRays[j].p1.x) * (s_point.x - waitingRays[j].p1.x) + (observed_intersection.y - waitingRays[j].p1.y) * (s_point.y - waitingRays[j].p1.y);
                  //(observed_intersection-waitingRays[j].p1)與(s_point-waitingRays[j].p1) Inner product
                }
                else
                {
                  rpd = (observed_intersection.x - waitingRays[j].p1.x) * (waitingRays[j].p2.x - waitingRays[j].p1.x) + (observed_intersection.y - waitingRays[j].p1.y) * (waitingRays[j].p2.y - waitingRays[j].p1.y);
                  //(observed_intersection-waitingRays[j].p1)與(waitingRays[j].p2-waitingRays[j].p1) Inner product
                }

                if (rpd < 0)
                {
                  //Virtual image
                  canvasPainter.draw(observed_intersection, 'rgb(255,128,0)'); //Draw something like
                }
                else if (rpd < s_lensq)
                {
                  //Real image
                  canvasPainter.draw(observed_intersection, 'rgb(255,255,128)'); //Draw something like
                }
                else
                {
                  //Void
                  canvasPainter.draw(observed_intersection, 'rgb(80,80,80)'); //Draw something like
                }
              }
              last_intersection = observed_intersection;
            }

          }




          if (last_s_obj_index != s_obj_index)
          {
            waitingRays[j].gap = true;
          }
          waitingRays[j].isNew = false;


          //==================
          //last_ray=waitingRays[j];
          last_ray = {p1: waitingRays[j].p1, p2: waitingRays[j].p2};
          //last_s_obj=s_obj;
          last_s_obj_index = s_obj_index;
          if (s_obj)
          {
            objTypes[s_obj.type].shot(s_obj, waitingRays[j], j, s_point, surfaceMerging_objs);
          }
          else
          {
            waitingRays[j] = null;
          }

          shotRayCount = shotRayCount + 1; //Number of processed light 1
          if (waitingRays[j] && waitingRays[j].exist)
          {
            leftRayCount = leftRayCount + 1;
          }
          //This light is processed
        }
      }

    }
    ctx.globalAlpha = 1.0;
    //if(showLight)
    //{
      for (var i = 0; i < objs.length; i++)
        {
        objTypes[objs[i].type].draw(objs[i], canvas, true); //Draw objs[i]
        }
    //}
    if (mode == 'observer')
    {
      //Draw an instant observer
      //var ctx = canvas.getContext('2d');
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.fillStyle = 'blue';
      ctx.arc(observer.c.x, observer.c.y, observer.r, 0, Math.PI * 2, false);
      ctx.fill();
    }
    if (forceStop)
    {
      document.getElementById('status').innerHTML = shotRayCount + ' rays (stopped)';
      forceStop = false;
    }
    else if (hasExceededTime)
    {
      document.getElementById('status').innerHTML = shotRayCount + ' rays';
    }
    else
    {
      document.getElementById('status').innerHTML = shotRayCount + ' rays (' + (new Date() - st_time) + 'ms)';
    }
    document.getElementById('forceStop').style.display = 'none';
    //ctx.stroke();
    setTimeout(draw_, 10);
  }



  //////////////////////////////////////////////////////////////////////////////////////////////////////
  //========================================Mouse action area==================================================
  //////////////////////////////////////////////////////////////////////////////////////////////////////


  function mouseOnPoint(mouse, point)
  {
    return graphs.length_squared(mouse, point) < clickExtent_point * clickExtent_point;
  }

  function mouseOnPoint_construct(mouse, point)
  {
    return graphs.length_squared(mouse, point) < clickExtent_point_construct * clickExtent_point_construct;
  }

  function mouseOnSegment(mouse, segment)
  {
    var d_per = Math.pow((mouse.x - segment.p1.x) * (segment.p1.y - segment.p2.y) + (mouse.y - segment.p1.y) * (segment.p2.x - segment.p1.x), 2) / ((segment.p1.y - segment.p2.y) * (segment.p1.y - segment.p2.y) + (segment.p2.x - segment.p1.x) * (segment.p2.x - segment.p1.x)); //Similar to the vertical distance between the mouse and the line
    var d_par = (segment.p2.x - segment.p1.x) * (mouse.x - segment.p1.x) + (segment.p2.y - segment.p1.y) * (mouse.y - segment.p1.y); //Similar to the position of the mouse on a straight line
    return d_per < clickExtent_line * clickExtent_line && d_par >= 0 && d_par <= graphs.length_segment_squared(segment);
  }

  function mouseOnLine(mouse, line)
  {
    var d_per = Math.pow((mouse.x - line.p1.x) * (line.p1.y - line.p2.y) + (mouse.y - line.p1.y) * (line.p2.x - line.p1.x), 2) / ((line.p1.y - line.p2.y) * (line.p1.y - line.p2.y) + (line.p2.x - line.p1.x) * (line.p2.x - line.p1.x)); //Similar to the vertical distance between the mouse and the line
    return d_per < clickExtent_line * clickExtent_line;
  }

  //Adsorbs the mouse position to the closest one in the specified direction (projection point on the straight line in that direction)
  function snapToDirection(mouse, basePoint, directions, snapData)
  {
    var x = mouse.x - basePoint.x;
    var y = mouse.y - basePoint.y;

    if (snapData && snapData.locked)
    {
      //The adsorbed object has been locked
      var k = (directions[snapData.i0].x * x + directions[snapData.i0].y * y) / (directions[snapData.i0].x * directions[snapData.i0].x + directions[snapData.i0].y * directions[snapData.i0].y);
      return graphs.point(basePoint.x + k * directions[snapData.i0].x, basePoint.y + k * directions[snapData.i0].y);
    }
    else
    {
      var i0;
      var d_sq;
      var d0_sq = Infinity;
      for (var i = 0; i < directions.length; i++)
      {
        d_sq = (directions[i].y * x - directions[i].x * y) * (directions[i].y * x - directions[i].x * y) / (directions[i].x * directions[i].x + directions[i].y * directions[i].y);
        if (d_sq < d0_sq)
        {
          d0_sq = d_sq;
          i0 = i;
        }
      }

      if (snapData && x * x + y * y > snapToDirection_lockLimit_squared)
      {
        //Lock adsorption object
        snapData.locked = true;
        snapData.i0 = i0;
      }

      var k = (directions[i0].x * x + directions[i0].y * y) / (directions[i0].x * directions[i0].x + directions[i0].y * directions[i0].y);
      return graphs.point(basePoint.x + k * directions[i0].x, basePoint.y + k * directions[i0].y);
    }
  }

  //================================================================================================================================
  //=========================================================MouseDown==============================================================
  function canvas_onmousedown(e) {
  //When the mouse is pressed
  //console.log(e.which);
  if (e.changedTouches) {
    var et = e.changedTouches[0];
  } else {
    var et = e;
  }
  var mouse_nogrid = graphs.point((et.pageX - e.target.offsetLeft - origin.x) / scale, (et.pageY - e.target.offsetTop - origin.y) / scale); //Actual position of the mouse
  mouse_lastmousedown = mouse_nogrid;
  if (positioningObj != -1)
  {
    confirmPositioning(e.ctrlKey, e.shiftKey);
    if (!(e.which && e.which == 3))
    {
      return;
    }
  }


  if (!((e.which && (e.which == 1 || e.which == 3)) || (e.changedTouches)))
  {
    return;
  }

  //if(document.getElementById("grid").checked || e.altKey)
  if (document.getElementById('grid').checked)
  {
    //Use grid lines
    mouse = graphs.point(Math.round(((et.pageX - e.target.offsetLeft - origin.x) / scale) / gridSize) * gridSize, Math.round(((et.pageY - e.target.offsetTop - origin.y) / scale) / gridSize) * gridSize);

  }
  else
  {
    //Do not use grid lines
    mouse = mouse_nogrid;
  }



  if (isConstructing)
  {
    if ((e.which && e.which == 1) || (e.changedTouches))
    {
      //Only the left mouse button responds
      //If an object is being created, pass the action directly to it.
      objTypes[objs[objs.length - 1].type].c_mousedown(objs[objs.length - 1], mouse);
    }
  }
  else
  {


    //var returndata;
    if ((!(document.getElementById('lockobjs').checked) != (e.altKey && AddingObjType != '')) && !(e.which == 3))
    {
      //Search for each object and find the object that the mouse clicks on

      draggingPart = {};

      if (mode == 'observer')
      {
        if (graphs.length_squared(mouse_nogrid, observer.c) < observer.r * observer.r)
        {
          //Mouse click to observer
          draggingObj = -4;
          draggingPart = {};
          //draggingPart.part=0;
          draggingPart.mouse0 = mouse; //The position of the mouse when you start dragging
          draggingPart.mouse1 = mouse; //The position of the mouse on the previous point when dragging
          draggingPart.snapData = {};
          return;
        }
      }

      var draggingPart_ = {};
      var click_lensq = Infinity;
      var click_lensq_temp;
      var targetObj_index = -1;
      //var targetObj_index_temp;
      var targetIsPoint = false;

      //for(var i=objs.length-1;i>=0;i--)
      for (var i = 0; i < objs.length; i++)
        {
        if (typeof objs[i] != 'undefined')
          {
            draggingPart_ = {};
            if (objTypes[objs[i].type].clicked(objs[i], mouse_nogrid, mouse, draggingPart_))
            {
              //clicked()Returning true means the mouse has pressed the object

              if (draggingPart_.targetPoint)
              {
                //Mouse click to a point
                targetIsPoint = true; //Once you find that you can press the point, you must press the point.
                click_lensq_temp = graphs.length_squared(mouse_nogrid, draggingPart_.targetPoint);
                if (click_lensq_temp <= click_lensq)
                {
                  targetObj_index = i; //Press to the point, select the closest mouse
                  click_lensq = click_lensq_temp;
                  draggingPart = draggingPart_;
                }
              }
              else if (!targetIsPoint)
              {
                //The mouse is not pointing to the point, and has not pressed to the point so far.
                targetObj_index = i; //Press to the non-point, select the last established
                draggingPart = draggingPart_;
              }

            }
          }
        }
        if (targetObj_index != -1)
        {
          //Finally decided to choose targetObj_index
          selectObj(targetObj_index);
          draggingPart.originalObj = JSON.parse(JSON.stringify(objs[targetObj_index])); //Temporarily storing the state of the object before the drag
          draggingPart.hasDuplicated = false;
          draggingObj = targetObj_index;
          return;
        }
      }

    if (draggingObj == -1)
      {
      //====================The mouse is pressed to the blank=============================
       if ((AddingObjType == '') || (e.which == 3))
       {
       //====================Ready to pan the entire screen===========================
         draggingObj = -3;
         draggingPart = {};
         //draggingPart.part=0;
         draggingPart.mouse0 = mouse; //The position of the mouse when you start dragging
         draggingPart.mouse1 = mouse; //The position of the mouse on the previous point when dragging
         draggingPart.mouse2 = origin; //Original origin.
         draggingPart.snapData = {};
         document.getElementById('obj_settings').style.display = 'none';
         selectedObj = -1;
       }
       else
       {
       //=======================Create new objects========================
        objs[objs.length] = objTypes[AddingObjType].create(mouse);
        isConstructing = true;
        constructionPoint = mouse;
        if (objs[selectedObj])
        {
          if (hasSameAttrType(objs[selectedObj], objs[objs.length - 1]))
          {
            objs[objs.length - 1].p = objs[selectedObj].p; //Let the attached property of this object be the same as the last selected object (if the type is the same)
          }
        }
        selectObj(objs.length - 1);
        objTypes[objs[objs.length - 1].type].c_mousedown(objs[objs.length - 1], mouse);
       }
      }
  }
  }
  //================================================================================================================================
  //========================================================MouseMove===============================================================
  function canvas_onmousemove(e) {
  //When the mouse moves
  if (e.changedTouches) {
    var et = e.changedTouches[0];
  } else {
    var et = e;
  }
  var mouse_nogrid = graphs.point((et.pageX - e.target.offsetLeft - origin.x) / scale, (et.pageY - e.target.offsetTop - origin.y) / scale); //Actual position of the mouse
  var mouse2;
  //if(document.getElementById("grid").checked != e.altKey)
  if (document.getElementById('grid').checked && !(e.altKey && !isConstructing))
  {
    //Use grid lines
    mouse2 = graphs.point(Math.round(((et.pageX - e.target.offsetLeft - origin.x) / scale) / gridSize) * gridSize, Math.round(((et.pageY - e.target.offsetTop - origin.y) / scale) / gridSize) * gridSize);
  }
  else
  {
    //Do not use grid lines
    mouse2 = mouse_nogrid;
  }

  if (mouse2.x == mouse.x && mouse2.y == mouse.y)
  {
    return;
  }
  mouse = mouse2;


  if (isConstructing)
  {
    //If an object is being created, pass the action directly to it.
    objTypes[objs[objs.length - 1].type].c_mousemove(objs[objs.length - 1], mouse, e.ctrlKey, e.shiftKey);
  }
  else
  {
    var instantObserver = mode == 'observed_light' || mode == 'observed_images';
    if (draggingObj == -4)
    {
      if (e.shiftKey)
      {
        var mouse_snapped = snapToDirection(mouse, draggingPart.mouse0, [{x: 1, y: 0},{x: 0, y: 1}], draggingPart.snapData);
      }
      else
      {
        var mouse_snapped = mouse;
        draggingPart.snapData = {}; //Release the original drag direction lock when releasing shift
      }

      var mouseDiffX = (mouse_snapped.x - draggingPart.mouse1.x); //The current X position of the mouse position and the position of the last mouse position
      var mouseDiffY = (mouse_snapped.y - draggingPart.mouse1.y); //The current Y position of the mouse position and the position of the last mouse position

      observer.c.x += mouseDiffX;
      observer.c.y += mouseDiffY;

      //Update mouse position
      draggingPart.mouse1 = mouse_snapped;
      draw();
    }

    var returndata;
    if (draggingObj >= 0)
      {
       //At this point, the mouse is dragging an object

      objTypes[objs[draggingObj].type].dragging(objs[draggingObj], mouse, draggingPart, e.ctrlKey, e.shiftKey);
      //If you are dragging the entire object, copy the original object when you press the Ctrl key
      if (draggingPart.part == 0)
      {
        if (e.ctrlKey && !draggingPart.hasDuplicated)
        {

          objs[objs.length] = draggingPart.originalObj;
          draggingPart.hasDuplicated = true;
        }
        if (!e.ctrlKey && draggingPart.hasDuplicated)
        {
          objs.length--;
          draggingPart.hasDuplicated = false;
        }
      }

      draw();
      }

    if (draggingObj == -3)
    {
      //====================Pan the entire screen===========================
      //At this time, the mouse is the current mouse position, and the draggingPart.mouse1 is the last mouse position.

      if (e.shiftKey)
      {
        var mouse_snapped = snapToDirection(mouse_nogrid, draggingPart.mouse0, [{x: 1, y: 0},{x: 0, y: 1}], draggingPart.snapData);
      }
      else
      {
        var mouse_snapped = mouse_nogrid;
        draggingPart.snapData = {}; //Release the original drag direction lock when releasing shift
      }

      var mouseDiffX = (mouse_snapped.x - draggingPart.mouse1.x); //The current X position of the mouse position and the position of the last mouse position
      var mouseDiffY = (mouse_snapped.y - draggingPart.mouse1.y); //The current Y position of the mouse position and the position of the last mouse position
      /*for (var i = 0; i < objs.length; i++)
      {
        objTypes[objs[i].type].move(objs[i], mouseDiffX, mouseDiffY);
      }*/
      //draggingPart.mouse1 = mouse_snapped; //Set &quot;Last mouse position&quot; to the current mouse position (for next use)
      /*if (observer)
      {
        observer.c.x += mouseDiffX;
        observer.c.y += mouseDiffY;
      }*/
      origin.x = mouseDiffX * scale + draggingPart.mouse2.x;
      origin.y = mouseDiffY * scale + draggingPart.mouse2.y;
      draw();
    }
  }
  }
  //==================================================================================================================================
  //==============================MouseUp===============================
  function canvas_onmouseup(e) {
  //When the mouse is released
  /*
  if(document.getElementById("grid").checked != e.ctrlKey)
  {
    //Use grid lines
    var mouse=graphs.point(Math.round((e.pageX-e.target.offsetLeft)/gridSize)*gridSize,Math.round((e.pageY-e.target.offsetTop)/gridSize)*gridSize)
  }
  else
  {
    //Do not use grid lines
    var mouse=graphs.point(e.pageX-e.target.offsetLeft,e.pageY-e.target.offsetTop)
  }
  */
  //document.getElementById('status').innerHTML=mouse.x;
  if (isConstructing)
  {
    if ((e.which && e.which == 1) || (e.changedTouches))
    {
      //If an object is being created, pass the action directly to it.
      objTypes[objs[objs.length - 1].type].c_mouseup(objs[objs.length - 1], mouse);
      if (!isConstructing)
      {
        //The object has been created
        createUndoPoint();
      }
    }
  }
  else
  {
    if (e.which && e.which == 3 && draggingObj == -3 && mouse.x == draggingPart.mouse0.x && mouse.y == draggingPart.mouse0.y)
    {
      draggingObj = -1;
      draggingPart = {};
      canvas_ondblclick(e);
      return;
    }
    draggingObj = -1;
    draggingPart = {};
    createUndoPoint();
  }



  }


  function canvas_ondblclick(e) {
    console.log("dblclick");
    var mouse = graphs.point((e.pageX - e.target.offsetLeft - origin.x) / scale, (e.pageY - e.target.offsetTop - origin.y) / scale); //The actual position of the mouse (no grid line is used)
    if (isConstructing)
    {
    }
    else if (mouseOnPoint(mouse, mouse_lastmousedown))
    {
      draggingPart = {};
      if (mode == 'observer')
      {
        if (graphs.length_squared(mouse, observer.c) < observer.r * observer.r)
        {

          //Mouse click to observer
          positioningObj = -4;
          draggingPart = {};
          draggingPart.targetPoint = graphs.point(observer.c.x, observer.c.y);
          draggingPart.snapData = {};

          document.getElementById('xybox').style.left = (draggingPart.targetPoint.x * scale + origin.x) + 'px';
          document.getElementById('xybox').style.top = (draggingPart.targetPoint.y * scale + origin.y) + 'px';
          document.getElementById('xybox').value = '(' + (draggingPart.targetPoint.x) + ',' + (draggingPart.targetPoint.y) + ')';
          document.getElementById('xybox').size = document.getElementById('xybox').value.length;
          document.getElementById('xybox').style.display = '';
          document.getElementById('xybox').select();
          document.getElementById('xybox').setSelectionRange(1, document.getElementById('xybox').value.length - 1);
          console.log("show xybox");
          //e.cancelBubble = true;
          //if (e.stopPropagation) e.stopPropagation();
          xyBox_cancelContextMenu = true;

          return;
        }
      }


      //Search for each object and find the object that the mouse clicks on
      var draggingPart_ = {};
      var click_lensq = Infinity;
      var click_lensq_temp;
      var targetObj_index = -1;
      //var targetObj_index_temp;
      //var targetIsPoint=false;

      //for(var i=objs.length-1;i>=0;i--)
      for (var i = 0; i < objs.length; i++)
        {
        if (typeof objs[i] != 'undefined')
          {
            draggingPart_ = {};
            if (objTypes[objs[i].type].clicked(objs[i], mouse, mouse, draggingPart_))
            {
              //clicked() Returning true means the mouse has pressed the object

              if (draggingPart_.targetPoint)
              {
                //Mouse click to a point
                //targetIsPoint=true; //Once you find that you can press the point, you must press the point.
                click_lensq_temp = graphs.length_squared(mouse, draggingPart_.targetPoint);
                if (click_lensq_temp <= click_lensq)
                {
                  targetObj_index = i; //Press to the point, select the closest mouse
                  click_lensq = click_lensq_temp;
                  draggingPart = draggingPart_;
                }
              }
            }
          }
        }
        if (targetObj_index != -1)
        {
          selectObj(targetObj_index);
          draggingPart.originalObj = JSON.parse(JSON.stringify(objs[targetObj_index])); //Temporarily storing the state of the object before the drag
          draggingPart.hasDuplicated = false;
          positioningObj = targetObj_index; //The object at the input location is set to i

          document.getElementById('xybox').style.left = (draggingPart.targetPoint.x * scale + origin.x) + 'px';
          document.getElementById('xybox').style.top = (draggingPart.targetPoint.y * scale + origin.y) + 'px';
          document.getElementById('xybox').value = '(' + (draggingPart.targetPoint.x) + ',' + (draggingPart.targetPoint.y) + ')';
          document.getElementById('xybox').size = document.getElementById('xybox').value.length;
          document.getElementById('xybox').style.display = '';
          document.getElementById('xybox').select();
          document.getElementById('xybox').setSelectionRange(1, document.getElementById('xybox').value.length - 1);
          console.log("show xybox");
          //e.cancelBubble = true;
          //if (e.stopPropagation) e.stopPropagation();
          xyBox_cancelContextMenu = true;
        }
    }

  }


  window.onresize = function(e) {
  if (ctx)
  {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }
  };

  function selectObj(index)
  {
    if (index < 0 || index >= objs.length)
    {
      //If the object does not exist
      selectedObj = -1;
      document.getElementById('obj_settings').style.display = 'none';
      return;
    }
    selectedObj = index;
    document.getElementById('obj_name').innerHTML = document.getElementById('tool_' + objs[index].type).dataset['n'];
    if (objTypes[objs[index].type].p_name)
    {
      //If the object has adjustable parameters (such as refractive index)
      document.getElementById('p_box').style.display = '';
      var p_temp = objs[index].p;
      //document.getElementById('p_name').innerHTML=objTypes[objs[index].type].p_name;
      document.getElementById('p_name').innerHTML = document.getElementById('tool_' + objs[index].type).dataset['p'];
      document.getElementById('objAttr_range').min = objTypes[objs[index].type].p_min;
      document.getElementById('objAttr_range').max = objTypes[objs[index].type].p_max;
      document.getElementById('objAttr_range').step = objTypes[objs[index].type].p_step;
      document.getElementById('objAttr_range').value = p_temp;
      document.getElementById('objAttr_text').value = p_temp;
      objs[index].p = p_temp;
      for (var i = 0; i < objs.length; i++)
      {
        if (i != selectedObj && hasSameAttrType(objs[i], objs[selectedObj]))
        {
          //If there is another object of the same type, the &quot;Apply All&quot; option is displayed.
          document.getElementById('setAttrAll_box').style.display = '';
          //document.getElementById('setAttrAll').checked=false;
          break;
        }
        if (i == objs.length - 1)
        {
          document.getElementById('setAttrAll_box').style.display = 'none';
        }
      }
    }
    else
    {
      document.getElementById('p_box').style.display = 'none';
    }

    document.getElementById('obj_settings').style.display = '';
  }

  function hasSameAttrType(obj1, obj2)
  {
    //obj1.type==obj2.type
    //objTypes[obj1.type].p_name==objTypes[obj2.type].p_name
    return document.getElementById('tool_' + obj1.type).dataset['n'] == document.getElementById('tool_' + obj2.type).dataset['n'];
  }

  function setAttr(value)
  {
    //alert(value)
    objs[selectedObj].p = value;
    document.getElementById('objAttr_text').value = value;
    document.getElementById('objAttr_range').value = value;
    if (document.getElementById('setAttrAll').checked)
    {
      for (var i = 0; i < objs.length; i++)
      {
        if (hasSameAttrType(objs[i], objs[selectedObj]))
        {
          objs[i].p = value;
        }
      }
    }
    draw();
  }

  function confirmPositioning(ctrl, shift)
  {
    var xyData = JSON.parse('[' + document.getElementById('xybox').value.replace(/\(|\)/g, '') + ']');
    //if(xyData.length==2)
    //Action only when two values (coordinates) are entered
    if (xyData.length == 2)
    {
      if (positioningObj == -4)
      {
        //Observer
        observer.c.x = xyData[0];
        observer.c.y = xyData[1];
      }
      else
      {
        //Property
        objTypes[objs[positioningObj].type].dragging(objs[positioningObj], graphs.point(xyData[0], xyData[1]), draggingPart, ctrl, shift);
      }
      draw();
      createUndoPoint();
    }

    endPositioning();
  }

  function endPositioning()
  {
    document.getElementById('xybox').style.display = 'none';
    positioningObj = -1;
    draggingPart = {};
  }

  function removeObj(index)
  {
    for (var i = index; i < objs.length - 1; i++)
    {
      objs[i] = JSON.parse(JSON.stringify(objs[i + 1]));
    }
    isConstructing = false;
    objs.length = objs.length - 1;
    selectedObj--;
    selectObj(selectedObj);
  }

  function createUndoPoint()
  {
    undoIndex = (undoIndex + 1) % undoLimit;
    undoUBound = undoIndex;
    document.getElementById('undo').disabled = false;
    document.getElementById('redo').disabled = true;
    undoArr[undoIndex] = document.getElementById('textarea1').value;
    if (undoUBound == undoLBound)
    {
      //The number of recovery steps has reached the upper limit
      undoLBound = (undoLBound + 1) % undoLimit;
    }
  }

  function undo()
  {
    if (isConstructing)
    {
      //If the user is creating an object when the recovery is pressed, then only the establishment action will be terminated without real restoration.

      isConstructing = false;
      objs.length--;
      selectObj(-1);

      draw();
      return;
    }
    if (positioningObj != -1)
    {
      //If the user is typing a coordinate when the recovery is pressed, then only the input coordinate action is terminated without real restoration.
      endPositioning();
      return;
    }
    if (undoIndex == undoLBound)
        //Has reached the lower bound of the recovery data
        return;
    undoIndex = (undoIndex + (undoLimit - 1)) % undoLimit;
    document.getElementById('textarea1').value = undoArr[undoIndex];
    JSONInput();
    document.getElementById('redo').disabled = false;
    if (undoIndex == undoLBound)
    {
      //Has reached the lower bound of the recovery data
      document.getElementById('undo').disabled = true;
    }

  }

  function redo()
  {
    isConstructing = false;
    endPositioning();
    if (undoIndex == undoUBound)
      //Has reached the lower bound of the recovery data
      return;
    undoIndex = (undoIndex + 1) % undoLimit;
    document.getElementById('textarea1').value = undoArr[undoIndex];
    JSONInput();
    document.getElementById('undo').disabled = false;
    if (undoIndex == undoUBound)
    {
      //Has reached the lower bound of the recovery data
      document.getElementById('redo').disabled = true;
    }
  }

  function initParameters()
  {
    isConstructing = false;
    endPositioning();
    objs.length = 0;
    selectObj(-1);

    //AddingObjType="";
    rayDensity_light = 0.1; //Light density (light related mode)
    rayDensity_images = 1; //Light density (like correlation mode)
    window.toolBarViewModel.rayDensity.value(rayDensity_light);
    extendLight = false; //Observer image
    showLight = true; //Display light
    origin = {x: 0, y: 0};
    observer = null;
    scale = 1;
    window.toolBarViewModel.zoom.value(scale * 100);
    //mode="light";
    toolbtn_clicked('laser');
    modebtn_clicked('light');

    //Reset new UI.
    window.toolBarViewModel.tools.selected("Ray");
    window.toolBarViewModel.modes.selected("Rays");
    window.toolBarViewModel.c1.selected(false);
    window.toolBarViewModel.c2.selected(false);
    window.toolBarViewModel.c3.selected(false);

    document.getElementById('lockobjs').checked = false;
    document.getElementById('grid').checked = false;
    document.getElementById('showgrid').checked = false;

    document.getElementById('setAttrAll').checked = false;

    draw();
    //createUndoPoint();
  }

  window.onkeydown = function(e)
  {
    //console.log(e.keyCode);
    //console.log(e.ctrlKey);

    //Ctrl+Z
    if (e.ctrlKey && e.keyCode == 90)
    {
      if (document.getElementById('undo').disabled == false)
      {
        undo();
      }
      return false;
    }

    //Ctrl+D
    if (e.ctrlKey && e.keyCode == 68)
    {
    objs[objs.length] = JSON.parse(JSON.stringify(objs[selectedObj]));
    draw();
    createUndoPoint();
    return false;
    }
    //Ctrl+Y
    if (e.ctrlKey && e.keyCode == 89)
    {
      document.getElementById('redo').onclick();
    }

    //Ctrl+S
    if (e.ctrlKey && e.keyCode == 83)
    {
      document.getElementById('save').onclick();
    }

    //Ctrl+O
    if (e.ctrlKey && e.keyCode == 79)
    {
      document.getElementById('open').onclick();
    }

    /*
    if(e.altKey && e.keyCode==78)
    {
    //Alt+N
    cleanAll();
    return false;
    }
    */
    /*
    if(e.altKey && e.keyCode==65)
    {
    //Alt+A
    document.getElementById("objAttr").focus()
    return false;
    }
    */
    //Delete
    if (e.keyCode == 46 || e.keyCode == 8)
    {
    if (selectedObj != -1)
    {
      removeObj(selectedObj);
      draw();
      createUndoPoint();
    }
    return false;
    }

    //esc
    if (e.keyCode == 27)
    {
      if (isConstructing)
      {
        removeObj(selectedObj);
        draw();
      }else{
        document.getElementById('obj_settings').style.display = 'none';
        window.toolBarViewModel.tools.selected("Move View"); //just selection move tool
        toolbtn_clicked(""); //this is actually activate-ing move tool

      }
      return false;
    }


    //Ctrl
    /*
    if(e.keyCode==17)
    {
      if(draggingObj!=-1)
      {
        canvas_onmousemove(e,true);
      }
    }
    */

    //Arrow Keys
    if (e.keyCode >= 37 && e.keyCode <= 40)
    {
      var step = document.getElementById('grid').checked ? gridSize : 1;
      if (selectedObj >= 0)
      {
        if (e.keyCode == 37)
        {
          objTypes[objs[selectedObj].type].move(objs[selectedObj], -step, 0);
        }
        if (e.keyCode == 38)
        {
          objTypes[objs[selectedObj].type].move(objs[selectedObj], 0, -step);
        }
        if (e.keyCode == 39)
        {
          objTypes[objs[selectedObj].type].move(objs[selectedObj], step, 0);
        }
        if (e.keyCode == 40)
        {
          objTypes[objs[selectedObj].type].move(objs[selectedObj], 0, step);
        }
      }
      else if (mode == 'observer')
      {
        if (e.keyCode == 37)
        {
          observer.c.x -= step;
        }
        if (e.keyCode == 38)
        {
          observer.c.y -= step;
        }
        if (e.keyCode == 39)
        {
          observer.c.x += step;
        }
        if (e.keyCode == 40)
        {
          observer.c.y += step;
        }
      }
      else
      {
        for (var i = 0; i < objs.length; i++)
        {
          if (e.keyCode == 37)
          {
            objTypes[objs[i].type].move(objs[i], -step, 0);
          }
          if (e.keyCode == 38)
          {
            objTypes[objs[i].type].move(objs[i], 0, -step);
          }
          if (e.keyCode == 39)
          {
            objTypes[objs[i].type].move(objs[i], step, 0);
          }
          if (e.keyCode == 40)
          {
            objTypes[objs[i].type].move(objs[i], 0, step);
          }
        }
      }
      draw();
    }



};

  window.onkeyup = function(e)
  {
    //Arrow Keys
    if (e.keyCode >= 37 && e.keyCode <= 40)
    {
      createUndoPoint();
    }

  };


  //=========================================JSONO utput/input====================================================
  function JSONOutput()
  {
    document.getElementById('textarea1').value = JSON.stringify({version: 2, objs: objs, mode: mode, rayDensity_light: rayDensity_light, rayDensity_images: rayDensity_images, observer: observer, origin: origin, scale: scale});
    if (typeof(Storage) !== "undefined") {
      localStorage.rayOpticsData = document.getElementById('textarea1').value;
    }
  }
  function JSONInput()
  {
    var jsonData = JSON.parse(document.getElementById('textarea1').value);
    if (typeof jsonData != 'object')return;
    //console.log(jsonData);
    if (!jsonData.version)
    {
      //For &quot;Line Optical Simulation 1.0&quot; or previous format
      //var str1=document.getElementById("textarea1").value.replace(/"point"|"xxa"/g,"1").replace(/"circle"|"xxf"/g,"5");
      var str1 = document.getElementById('textarea1').value.replace(/"point"|"xxa"|"aH"/g, '1').replace(/"circle"|"xxf"/g, '5').replace(/"k"/g, '"objs"').replace(/"L"/g, '"p1"').replace(/"G"/g, '"p2"').replace(/"F"/g, '"p3"').replace(/"bA"/g, '"exist"').replace(/"aa"/g, '"parallel"').replace(/"ba"/g, '"mirror"').replace(/"bv"/g, '"lens"').replace(/"av"/g, '"notDone"').replace(/"bP"/g, '"lightAlpha"').replace(/"ab"|"observed_light"|"observed_images"/g, '"observer"');
      jsonData = JSON.parse(str1);
      if (!jsonData.objs)
      {
        jsonData = {objs: jsonData};
      }
      if (!jsonData.mode)
      {
        jsonData.mode = 'light';
      }
      if (!jsonData.rayDensity_light)
      {
        jsonData.rayDensity_light = 1;
      }
      if (!jsonData.rayDensity_images)
      {
        jsonData.rayDensity_images = 1;
      }
      if (!jsonData.scale)
      {
        jsonData.scale = 1;
      }
      jsonData.version = 1;
    }
    if (jsonData.version == 1)
    {
      //"Line Optical Simulation 1.1&quot; to &quot;Line Optical Simulation 1.2&quot;
      jsonData.origin = {x: 0, y: 0};
    }
    if (jsonData.version > 2)
    {
      //For a new file version than this version
      return;
    }
    //TODO: Create new version.
    if (!jsonData.scale)
    {
      jsonData.scale = 1;
    }

    objs = jsonData.objs;
    rayDensity_light = jsonData.rayDensity_light;
    rayDensity_images = jsonData.rayDensity_images;
    observer = jsonData.observer;
    origin = jsonData.origin;
    scale = jsonData.scale;
    modebtn_clicked(jsonData.mode);
    selectObj(selectedObj);
    //draw();
  }

  function accessJSON()
  {
    if (document.getElementById('textarea1').style.display == 'none')
    {
      document.getElementById('textarea1').style.display = '';
      document.getElementById('textarea1').select();
    }
    else
    {
      document.getElementById('textarea1').style.display = 'none';
    }

  }


  function toolbtn_mouseentered(tool, e)
  {
    hideAllLists();
  }

  function toolbtn_clicked(tool, e)
  {

    tools_normal.forEach(function(element, index)
    {
      document.getElementById('tool_' + element).className = 'toolbtn';

    });
    tools_withList.forEach(function(element, index)
    {
      document.getElementById('tool_' + element).className = 'toolbtn';
    });
    tools_inList.forEach(function(element, index)
    {
      document.getElementById('tool_' + element).className = 'toollistbtn';
    });

    hideAllLists();

    document.getElementById('tool_' + tool).className = 'toolbtnselected';
    AddingObjType = tool;
    if (tool == "mirror_") {
      var t = window.toolBarViewModel.mirrors.selected();
      if (t == "Segment")
        AddingObjType = "mirror";
      else if (t == "Circular Arc")
        AddingObjType = "arcmirror";
      else if (t == "Ideal Curved")
        AddingObjType = "idealmirror";
    } else if (tool == "refractor_") {
      var t = window.toolBarViewModel.glasses.selected();
      if (t == "Half-plane")
        AddingObjType = "halfplane";
      else if (t == "Circle")
        AddingObjType = "circlelens";
      else if (t == "Free-shape")
        AddingObjType = "refractor";
      else if (t == "Ideal Lens")
        AddingObjType = "lens";
    }
  }

  function toolbtnwithlist_mouseentered(tool, e)
  {
    //console.log("tool_"+tool)
    /*hideAllLists();
    var rect = document.getElementById('tool_' + tool).getBoundingClientRect();
    //console.log(document.getElementById("tool_"+tool+"list"))
    document.getElementById('tool_' + tool + 'list').style.left = rect.left + 'px';
    document.getElementById('tool_' + tool + 'list').style.top = rect.bottom + 'px';
    document.getElementById('tool_' + tool + 'list').style.display = '';
    if (document.getElementById('tool_' + tool).className == 'toolbtn')
    {
      document.getElementById('tool_' + tool).className = 'toolbtnwithlisthover';
    }*/
  }

  function toolbtnwithlist_mouseleft(tool, e)
  {
    //console.log("btnout")

    /*var rect = document.getElementById('tool_' + tool + 'list').getBoundingClientRect();
    mouse = graphs.point(e.pageX, e.pageY);
    //console.log(rect)
    //console.log(mouse)
    if (mouse.x < rect.left || mouse.x > rect.right || mouse.y < rect.top - 5 || mouse.y > rect.bottom)
    {
      //The mouse is not on the drop down menu
      document.getElementById('tool_' + tool + 'list').style.display = 'none';
      if (document.getElementById('tool_' + tool).className == 'toolbtnwithlisthover')
      {
        document.getElementById('tool_' + tool).className = 'toolbtn';
      }
    }*/

  }

  function toollist_mouseleft(tool, e)
  {
    //console.log("listout")
    var rect = document.getElementById('tool_' + tool).getBoundingClientRect();
    mouse = graphs.point(e.pageX, e.pageY);
    if (mouse.x < rect.left || mouse.x > rect.right || mouse.y < rect.top || mouse.y > rect.bottom + 5)
    {
      //The mouse is not on the button with the drop down menu
      document.getElementById('tool_' + tool + 'list').style.display = 'none';
      if (document.getElementById('tool_' + tool).className == 'toolbtnwithlisthover')
      {
        document.getElementById('tool_' + tool).className = 'toolbtn';
      }
    }
  }

  function hideAllLists()
  {
    tools_withList.forEach(function(element, index)
    {
      document.getElementById('tool_' + element + 'list').style.display = 'none';
      if (document.getElementById('tool_' + element).className == 'toolbtnwithlisthover')
      {
        document.getElementById('tool_' + element).className = 'toolbtn';
      }
    });
  }

  function toollistbtn_clicked(tool, e)
  {
    //document.getElementById("tool_"+AddingObjType).className="toolbtn";

    var selected_toolbtn; //Previously pressed toolbtn
    var selecting_toolbtnwithlist; //The toolbtnwithlist to which this toollistbtn belongs
    tools_withList.forEach(function(element, index)
    {
      if (document.getElementById('tool_' + element).className == 'toolbtnwithlisthover')
      {
        selecting_toolbtnwithlist = element;
      }
      if (document.getElementById('tool_' + element).className == 'toolbtnselected')
      {
        selected_toolbtn = element;
      }
    });
    //console.log([selected_toolbtn,selecting_toolbtnwithlist]);
    if (!selecting_toolbtnwithlist)
    {
      selecting_toolbtnwithlist = selected_toolbtn; //This toollistbtn belongs to the previously pressed toolbtn
    }
    //console.log(selecting_toolbtnwithlist);
    tools_normal.forEach(function(element, index)
    {
      document.getElementById('tool_' + element).className = 'toolbtn';
    });
    tools_withList.forEach(function(element, index)
    {
      document.getElementById('tool_' + element).className = 'toolbtn';
    });
    tools_inList.forEach(function(element, index)
    {
      document.getElementById('tool_' + element).className = 'toollistbtn';
    });

    hideAllLists();

    document.getElementById('tool_' + selecting_toolbtnwithlist).className = 'toolbtnselected';
    document.getElementById('tool_' + tool).className = 'toollistbtnselected';
    AddingObjType = tool;
  }


  function modebtn_clicked(mode1)
  {
    document.getElementById('mode_' + mode).className = 'toolbtn';
    document.getElementById('mode_' + mode1).className = 'toolbtnselected';
    mode = mode1;
    if (mode == 'images' || mode == 'observer')
    {
      //document.getElementById('rayDensity').value = Math.log(rayDensity_images);
      window.toolBarViewModel.rayDensity.value(Math.log(rayDensity_images));
    }
    else
    {
      //document.getElementById('rayDensity').value = Math.log(rayDensity_light);
      window.toolBarViewModel.rayDensity.value(Math.log(rayDensity_light));
    }
    if (mode == 'observer' && !observer)
    {
      //Initialize the observer
      observer = graphs.circle(graphs.point((canvas.width * 0.5 - origin.x) / scale, (canvas.height * 0.5 - origin.y) / scale), 20);
    }


    draw();
  }



  function cancelMousedownEvent(id)
  {
    document.getElementById(id).onmousedown = function(e)
    {
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
    };
    document.getElementById(id).ontouchstart = function(e)
    {
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
    };
  }


  function setRayDensity(value)
  {
    if (mode == 'images' || mode == 'observer')
    {
      rayDensity_images = value;
    }
    else
    {
      rayDensity_light = value;
    }
  }

  function setScale(value) {
    setScaleWithCenter(value, canvas.width / scale / 2, canvas.height / scale / 2);
  }

  function setScaleWithCenter(value, centerX, centerY) {
    scaleChange = value - scale;
    origin.x *= value / scale;
    origin.y *= value / scale;
    origin.x -= centerX * scaleChange;
    origin.y -= centerY * scaleChange;
    scale = value;
    draw();
  }

  function save()
  {
    JSONOutput();

    var blob = new Blob([document.getElementById('textarea1').value], {type: 'application/json'});
    saveAs(blob, document.getElementById('save_name').value);

    document.getElementById('saveBox').style.display = 'none';
  }

  function open(readFile)
  {
    var reader = new FileReader();
    document.getElementById('save_name').value = readFile.name;
    reader.readAsText(readFile);
    reader.onload = function(evt) {
      var fileString = evt.target.result;
      document.getElementById('textarea1').value = fileString;
      endPositioning();
      selectedObj = -1;
      JSONInput();
      createUndoPoint();
    };

  }

  var lang = 'en';
  function getMsg(msg) {
    //if (typeof chrome != 'undefined') {
    //  return chrome.i18n.getMessage(msg);
    //} else {
    return locales[lang][msg].message;
    //}
  }

  function init_i18n() {
    if (navigator.language) {
      var browser_lang = navigator.language;
      if (browser_lang.toLowerCase() == 'zh-tw') {
        lang = 'zh-TW';
      }
      if (browser_lang.toLowerCase() == 'zh-cn') {
        lang = 'zh-CN';
      }
    }

    var url_lang = location.search.substr(1)
    if (url_lang && locales[url_lang]) {
      lang = url_lang;
    }


    var downarraw = '\u25BC';
    //var downarraw="\u25BE";
    document.title = getMsg('appName');

    //===========toolbar===========
    document.getElementById('toolbar_title').innerHTML = getMsg('toolbar_title');

    //Ray
    document.getElementById('tool_laser').value = getMsg('toolname_laser');
    document.getElementById('tool_laser').dataset['n'] = getMsg('toolname_laser');

    //Point source
    document.getElementById('tool_radiant').value = getMsg('toolname_radiant');
    document.getElementById('tool_radiant').dataset['n'] = getMsg('toolname_radiant');
    document.getElementById('tool_radiant').dataset['p'] = getMsg('brightness');

    //Beam
    document.getElementById('tool_parallel').value = getMsg('toolname_parallel');
    document.getElementById('tool_parallel').dataset['n'] = getMsg('toolname_parallel');
    document.getElementById('tool_parallel').dataset['p'] = getMsg('brightness');

    //Mirror▼
    document.getElementById('tool_mirror_').value = getMsg('toolname_mirror_') + downarraw;

    //Mirror->Line
    document.getElementById('tool_mirror').value = getMsg('tooltitle_mirror');
    document.getElementById('tool_mirror').dataset['n'] = getMsg('toolname_mirror_');

    //Mirror->Circular Arc
    document.getElementById('tool_arcmirror').value = getMsg('tooltitle_arcmirror');
    document.getElementById('tool_arcmirror').dataset['n'] = getMsg('toolname_mirror_');

    //Mirror->Curve (ideal)
    document.getElementById('tool_idealmirror').value = getMsg('tooltitle_idealmirror');
    document.getElementById('tool_idealmirror').dataset['n'] = getMsg('toolname_idealmirror');
    document.getElementById('tool_idealmirror').dataset['p'] = getMsg('focallength');

    //Refractor▼
    document.getElementById('tool_refractor_').value = getMsg('toolname_refractor_') + downarraw;

    //Refractor->Half-plane
    document.getElementById('tool_halfplane').value = getMsg('tooltitle_halfplane');
    document.getElementById('tool_halfplane').dataset['n'] = getMsg('toolname_refractor_');
    document.getElementById('tool_halfplane').dataset['p'] = getMsg('refractiveindex');

    //Refractor->Circle
    document.getElementById('tool_circlelens').value = getMsg('tooltitle_circlelens');
    document.getElementById('tool_circlelens').dataset['n'] = getMsg('toolname_refractor_');
    document.getElementById('tool_circlelens').dataset['p'] = getMsg('refractiveindex');

    //Refractor->Other shape
    document.getElementById('tool_refractor').value = getMsg('tooltitle_refractor');
    document.getElementById('tool_refractor').dataset['n'] = getMsg('toolname_refractor_');
    document.getElementById('tool_refractor').dataset['p'] = getMsg('refractiveindex');

    //Refractor->Lens (ideal)
    document.getElementById('tool_lens').value = getMsg('tooltitle_lens');
    document.getElementById('tool_lens').dataset['n'] = getMsg('toolname_lens');
    document.getElementById('tool_lens').dataset['p'] = getMsg('focallength');

    //Blocker
    document.getElementById('tool_blackline').value = getMsg('toolname_blackline');
    document.getElementById('tool_blackline').dataset['n'] = getMsg('toolname_blackline');

    //Ruler
    document.getElementById('tool_ruler').value = getMsg('toolname_ruler');
    document.getElementById('tool_ruler').dataset['n'] = getMsg('toolname_ruler');

    //Protractor
    document.getElementById('tool_protractor').value = getMsg('toolname_protractor');
    document.getElementById('tool_protractor').dataset['n'] = getMsg('toolname_protractor');

    //Move view
    document.getElementById('tool_').value = getMsg('toolname_');



    //===========modebar===========
    document.getElementById('modebar_title').innerHTML = getMsg('modebar_title');
    document.getElementById('mode_light').value = getMsg('modename_light');
    document.getElementById('mode_extended_light').value = getMsg('modename_extended_light');
    document.getElementById('mode_images').value = getMsg('modename_images');
    document.getElementById('mode_observer').value = getMsg('modename_observer');
    document.getElementById('rayDensity_title').innerHTML = getMsg('raydensity');


    document.getElementById('undo').value = getMsg('undo');
    document.getElementById('redo').value = getMsg('redo');
    document.getElementById('reset').value = getMsg('reset');
    document.getElementById('save').value = getMsg('save');
    document.getElementById('save_name_title').innerHTML = getMsg('save_name');
    document.getElementById('save_confirm').value = getMsg('save');
    document.getElementById('save_cancel').value = getMsg('save_cancel');
    document.getElementById('save_description').innerHTML = getMsg('save_description');
    document.getElementById('open').value = getMsg('open');
    document.getElementById('lockobjs_title').innerHTML = getMsg('lockobjs');
    document.getElementById('grid_title').innerHTML = getMsg('snaptogrid');
    document.getElementById('showgrid_title').innerHTML = getMsg('grid');

    document.getElementById('setAttrAll_title').innerHTML = getMsg('applytoall');
    document.getElementById('copy').value = getMsg('duplicate');
    document.getElementById('delete').value = getMsg('delete');

    document.getElementById('forceStop').innerHTML = getMsg('processing');

    document.getElementById('footer_message').innerHTML = getMsg('footer_message');
    document.getElementById('source').innerHTML = getMsg('source');
  }
