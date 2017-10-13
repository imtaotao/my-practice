$ = jQuery

getTransform = (from, to) ->
  console.assert from.length == to.length == 4

  A = [] # 8x8
  for i in [0 ... 4]
    A.push [from[i].x, from[i].y, 1, 0, 0, 0, -from[i].x * to[i].x, -from[i].y * to[i].x]
    A.push [0, 0, 0, from[i].x, from[i].y, 1, -from[i].x * to[i].y, -from[i].y * to[i].y]

  b = [] # 8x1
  for i in [0 ... 4]
    b.push to[i].x
    b.push to[i].y

  # Solve A * h = b for h
  h = numeric.solve(A, b)

  H = [[h[0], h[1], 0, h[2]],
       [h[3], h[4], 0, h[5]],
       [   0,    0, 1,    0],
       [h[6], h[7], 0,    1]]

  # Sanity check that H actually maps `from` to `to`
  for i in [0 ... 4]
      lhs = numeric.dot(H, [from[i].x, from[i].y, 0, 1])
      k_i = lhs[3]
      rhs = numeric.dot(k_i, [to[i].x, to[i].y, 0, 1])
      console.assert(numeric.norm2(numeric.sub(lhs, rhs)) < 1e-9, "Not equal:", lhs, rhs)
  H

applyTransform = (element, originalPos, targetPos, callback) ->
  # All offsets were calculated relative to the document
  # Make them relative to (0, 0) of the element instead
  from = for p in originalPos
    x: p[0] - originalPos[0][0]
    y: p[1] - originalPos[0][1]
  to = for p in targetPos
    x: p[0] - originalPos[0][0]
    y: p[1] - originalPos[0][1]

  # Solve for the transform
  H = getTransform(from, to)
  
  # Apply the matrix3d as H transposed because matrix3d is column major order
  # Also need use toFixed because css doesn't allow scientific notation
  $(element).css
    'transform': "matrix3d(#{(H[j][i].toFixed(20) for j in [0...4] for i in [0...4]).join(',')})"
    'transform-origin': '0 0'

  callback?(element, H)

makeTransformable = (selector, callback) ->
  $(selector).each (i, element) ->
    $(element).css('transform', '')
    
    # Add four dots to corners of `element` as control points
    controlPoints = for position in ['left top', 'left bottom', 'right top', 'right bottom']
      $('<div>')
        .css
          border: '10px solid black'
          borderRadius: '10px'
          cursor: 'move'
          position: 'absolute'
          zIndex: 100000
        .appendTo 'body'
        .position
          at: position
          of: element
          collision: 'none'

    # Record the original positions of the dots
    originalPos = ([p.offset().left, p.offset().top] for p in controlPoints)
    
    # Transform `element` to match the new positions of the dots whenever dragged
    $(controlPoints).draggable
      start: =>
        $(element).css('pointer-events', 'none') # makes dragging around iframes easier 
      drag: => 
        applyTransform(element, originalPos, ([p.offset().left, p.offset().top] for p in controlPoints), callback)
      stop: => 
        applyTransform(element, originalPos, ([p.offset().left, p.offset().top] for p in controlPoints), callback)
        $(element).css('pointer-events', 'auto')

    element

makeTransformable('.box', (element, H) ->
  console.log($(element).css('transform'))
  $(element).html(
    $('<table>')
      .append(
        $('<tr>').html(
          $('<td>').text('matrix3d(')
        )
      )
      .append(
        for i in [0 ... 4]
          $('<tr>').append(
            for j in [0 ... 4]
              $('<td>').text(H[j][i] + if i == j == 3 then '' else ',')
          )
      )
      .append(
        $('<tr>').html(
          $('<td>').text(')')
        )
      )
  )
)