(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* change FORWARD_SPEED to change the speed of the spaceship *?
TODO, at some point the code need to be refactored to an obj, so it is not in the global scoap. Or should it? It is nice to have some global variables that can be accessed from any where. I guess eventually this should const, but since ES6 is not yet currently widely supported in the browser, I had to resort to this kind of naming convention comprmise! (:)
https://api.ipify.org?format=json
*/
var FORWARD_SPEED = 15;
var m = require('mithril');


var spaceBookUsers = [];
/*
      var url = "https://spacebook.nu/users.json";
      // No need for m.prop since m.request returns a GetterSetter too
      var spaceBookUsers = m.request({
          method: 'GET',
          url: url
      }).then(function (usersArray) {
          console.log("user almost filled", usersArray);
          // And remember to return the value to the GetterSetter
          return usersArray;
      });
      */
/*////////////////////Stuff Above Are Experimental//////////////////////////////////*/

function controller360(deg, alterDeg){

  if(alterDeg > 0){
    if(deg >= 360)
      return 0
  }

  if(alterDeg < 0){
    //console.log('deg-alterDeg', deg, alterDeg, deg-alterDeg)
    if(deg <= 0)
      return 360
  }
  
  return deg*1+alterDeg    

}

var firstFrame = 0,
firstFrame2 = 0 ;
function getVectorXy(xCoord, yCoord, angle, length) {
    //console.log('getvectorxy', xCoord, yCoord, angle, length); 
    length = typeof length !== 'undefined' ? length : 10;
    angle = angle * Math.PI / 180; // if you're using degrees instead of radians
    var xy =  [length * Math.cos(angle) + xCoord, length * Math.sin(angle) + yCoord]

    var w = window.innerWidth;
    var h = window.innerHeight;
    console.log('wh', w, h)
    
    // if the spaceship goes off screen horizontal
    if(xy[0] >= w){
      console.log('shfit horizontal')
    
      firstFrame = w
      window.scrollTo(xy[0] - (w/2), firstFrame2);
    }
    if((firstFrame > 0) && (xy[0] <= w)){
      console.log('shfit back horizontal')
      window.scrollTo(0, firstFrame2);
    } 

    // if the spaceship goes off screen vertical
    if(xy[1] >= h){
      firstFrame2 = h
      console.log('shfit vertical ')
      
      window.scrollTo(firstFrame, xy[1] - (h/2));
    }
    if((firstFrame2 > 0) && (xy[1] <= h)){
      console.log('shfit back vertical ')
      window.scrollTo(firstFrame, 0);
    } 

    //console.log('window inner ', w, h, xy[0], firstFrame)
    return xy
}



function cssRotate(deg, xy){

  deg = deg + 90
  return ' -webkit-transform: rotate('+deg+'deg);'
    +'-moz-transform: rotate('+deg+'deg);'
    +'-o-transform: rotate('+deg+'deg);'
    +'-ms-transform: rotate('+deg+'deg);'
    +'transform: rotate('+deg+'deg);'
    +'position: absolute;'
    +'left: ' + xy[0] + 'px;'
    +'top: ' + xy[1] + 'px;'
    +'z-index: 100;'
  + 'animation-duration: 0.5s;'
  + 'animation-name: player-flash;'
  + 'animation-iteration-count: infinite;'
  + 'animation-direction: alternate-reverse;'
    


}

var space = {
    controller: function() {



      return {
      playerPosition : m.prop([0,0]), 
      playerPositionX : m.prop(0), 
      playerPositionY : m.prop(0), 
      playerRotation : m.prop(0), 
      playerStyle  : m.prop(cssRotate(0,[0,0])),
      sprite:
        {
          space:
            [
              'img/space/01.png',
              'img/space/02.png'

            ]
          ,
          player:
            [
              'img/player/01.png',
              'img/player/02.png',
              'img/player/03.png',
              'img/player/04.png',
              'img/player/05.png',
            ],
          planet:
            [
              'img/planet/fuzzy.png',
              'img/planet/halfsqagel.png',
              'img/planet/smaeklung.png',
              'img/planet/xx.png',
              'img/planet/semisqyare-planet.png'
            ]
        },
        links : [
          "http://amok.wtf/spacebridge/"
        ]
      }
    },
    
    
    view: function(ctrl) {
      //console.log('spaceBookUsers', spaceBookUsers())
      var deg, 
      theShip =  m('img#player', { style : ctrl.playerStyle(),  src: ctrl.sprite.player[0]});

            
      document.onkeydown = function(event) {
        //console.log(event.keyCode)
console.log(ctrl.playerRotation() )

        switch(event.keyCode){
          case 37: //<-
            event.preventDefault()          
            deg = controller360(ctrl.playerRotation(), -1)
            ctrl.playerRotation(deg)
            ctrl.playerStyle( cssRotate( deg, ctrl.playerPosition()  ) )

            m.redraw()
            break;
      
          case 39: //->
            event.preventDefault()
            deg = controller360(ctrl.playerRotation(), +1)
            ctrl.playerRotation(deg)
            ctrl.playerStyle( cssRotate( deg, ctrl.playerPosition()  ) )
            
            m.redraw()
            break;

          case 40: // down arrow key
            event.preventDefault()
            break

          case 38: // ^ up arrow key
            xCoord = window.scrollX
            yCoord = window.scrollY
            resolution = FORWARD_SPEED
            var xy = getVectorXy(ctrl.playerPositionX(), ctrl.playerPositionY(), ctrl.playerRotation(), resolution)

            // save new position
            ctrl.playerPositionX(xy[0])
            ctrl.playerPositionY(xy[1])
            ctrl.playerPosition(xy)

            // set the style sheet
            ctrl.playerStyle( cssRotate( ctrl.playerRotation(), [ctrl.playerPositionX(), ctrl.playerPositionY()]  ) )
            //console.log('current position: ', ctrl.playerPosition(), xy)            
            m.redraw()
            break;
        }
      }

//    console.log('sprit', ctrl.sprite.planet[0], ctrl.sprite.player[Date.now()%ctrl.sprite.player.length-1])
        return m('.app', [
            m('.rotate', [ 
//              m('img.space', {src: ctrl.sprite.space[1]}),
              m('img.space', {src: ctrl.sprite.space[0]}),
              theShip,
              
              /*
              
              m('img.spacebook-users', {src: ctrl.sprite.planet[1]}),
              m('img.spacebook-users', {src: ctrl.sprite.planet[2]}),
              m('img.spacebook-users', {src: ctrl.sprite.planet[3]})
              */

              spaceBookUsers.map(function(sUser){
                return m('.artist-names', sUser.name,[ 
                          m('img.spacebook-users', {src: sUser.image})
                        ]
                      )
              })

            ]),
            m('.planet', [
              m('img', {src: ctrl.sprite.planet[0]}),
              m('img.player', {src: ctrl.sprite.player[Date.now()%ctrl.sprite.player.length-1]})
//              m('iframe.amok', {src: ctrl.links[0]})
            ]),

            m('#p1.planet', [
              m('img', {src: ctrl.sprite.planet[1]}),
            ]),

            m('#p2.planet', [
              m('img', {src: ctrl.sprite.planet[2]}),
            ]),

            m('#p3.planet', [
              m('img', {src: ctrl.sprite.planet[3]}),
            ]),


            m('#p4.planet', [
              m('img', {src: ctrl.sprite.planet[4]}),
            ]),


            m('h1.title', "$./rum3")
          ]
        )
    }
}


window.onload = function(){
    m.mount(document.body, space)
}




},{"mithril":2}],2:[function(require,module,exports){
;(function (global, factory) { // eslint-disable-line

	"use strict"

	/* eslint-disable no-undef */

	var m = factory(global)

	if (typeof module === "object" && module != null && module.exports) {

		module.exports = m

	} else if (typeof define === "function" && define.amd) {

		define(function () { return m })

	} else {

		global.m = m

	}

	/* eslint-enable no-undef */

})(typeof window !== "undefined" ? window : this, function (global, undefined) { // eslint-disable-line

	"use strict"



	m.version = function () {

		return "v0.2.3"

	}



	var hasOwn = {}.hasOwnProperty

	var type = {}.toString



	function isFunction(object) {

		return typeof object === "function"

	}



	function isObject(object) {

		return type.call(object) === "[object Object]"

	}



	function isString(object) {

		return type.call(object) === "[object String]"

	}



	var isArray = Array.isArray || function (object) {

		return type.call(object) === "[object Array]"

	}



	function noop() {}



	var voidElements = {

		AREA: 1,

		BASE: 1,

		BR: 1,

		COL: 1,

		COMMAND: 1,

		EMBED: 1,

		HR: 1,

		IMG: 1,

		INPUT: 1,

		KEYGEN: 1,

		LINK: 1,

		META: 1,

		PARAM: 1,

		SOURCE: 1,

		TRACK: 1,

		WBR: 1

	}



	// caching commonly used variables

	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame



	// self invoking function needed because of the way mocks work

	function initialize(mock) {

		$document = mock.document

		$location = mock.location

		$cancelAnimationFrame = mock.cancelAnimationFrame || mock.clearTimeout

		$requestAnimationFrame = mock.requestAnimationFrame || mock.setTimeout

	}



	// testing API

	m.deps = function (mock) {

		initialize(global = mock || window)

		return global

	}



	m.deps(global)



	/**

	 * @typedef {String} Tag

	 * A string that looks like -> div.classname#id[param=one][param2=two]

	 * Which describes a DOM node

	 */



	function parseTagAttrs(cell, tag) {

		var classes = []

		var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g

		var match



		while ((match = parser.exec(tag))) {

			if (match[1] === "" && match[2]) {

				cell.tag = match[2]

			} else if (match[1] === "#") {

				cell.attrs.id = match[2]

			} else if (match[1] === ".") {

				classes.push(match[2])

			} else if (match[3][0] === "[") {

				var pair = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/.exec(match[3])

				cell.attrs[pair[1]] = pair[3] || ""

			}

		}



		return classes

	}



	function getVirtualChildren(args, hasAttrs) {

		var children = hasAttrs ? args.slice(1) : args



		if (children.length === 1 && isArray(children[0])) {

			return children[0]

		} else {

			return children

		}

	}



	function assignAttrs(target, attrs, classes) {

		var classAttr = "class" in attrs ? "class" : "className"



		for (var attrName in attrs) {

			if (hasOwn.call(attrs, attrName)) {

				if (attrName === classAttr &&

						attrs[attrName] != null &&

						attrs[attrName] !== "") {

					classes.push(attrs[attrName])

					// create key in correct iteration order

					target[attrName] = ""

				} else {

					target[attrName] = attrs[attrName]

				}

			}

		}



		if (classes.length) target[classAttr] = classes.join(" ")

	}



	/**

	 *

	 * @param {Tag} The DOM node tag

	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs

	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array,

	 *                      or splat (optional)

	 */

	function m(tag, pairs) {

		var args = []



		for (var i = 1, length = arguments.length; i < length; i++) {

			args[i - 1] = arguments[i]

		}



		if (isObject(tag)) return parameterize(tag, args)



		if (!isString(tag)) {

			throw new Error("selector in m(selector, attrs, children) should " +

				"be a string")

		}



		var hasAttrs = pairs != null && isObject(pairs) &&

			!("tag" in pairs || "view" in pairs || "subtree" in pairs)



		var attrs = hasAttrs ? pairs : {}

		var cell = {

			tag: "div",

			attrs: {},

			children: getVirtualChildren(args, hasAttrs)

		}



		assignAttrs(cell.attrs, attrs, parseTagAttrs(cell, tag))

		return cell

	}



	function forEach(list, f) {

		for (var i = 0; i < list.length && !f(list[i], i++);) {

			// function called in condition

		}

	}



	function forKeys(list, f) {

		forEach(list, function (attrs, i) {

			return (attrs = attrs && attrs.attrs) &&

				attrs.key != null &&

				f(attrs, i)

		})

	}

	// This function was causing deopts in Chrome.

	function dataToString(data) {

		// data.toString() might throw or return null if data is the return

		// value of Console.log in some versions of Firefox (behavior depends on

		// version)

		try {

			if (data != null && data.toString() != null) return data

		} catch (e) {

			// silently ignore errors

		}

		return ""

	}



	// This function was causing deopts in Chrome.

	function injectTextNode(parentElement, first, index, data) {

		try {

			insertNode(parentElement, first, index)

			first.nodeValue = data

		} catch (e) {

			// IE erroneously throws error when appending an empty text node

			// after a null

		}

	}



	function flatten(list) {

		// recursively flatten array

		for (var i = 0; i < list.length; i++) {

			if (isArray(list[i])) {

				list = list.concat.apply([], list)

				// check current index again and flatten until there are no more

				// nested arrays at that index

				i--

			}

		}

		return list

	}



	function insertNode(parentElement, node, index) {

		parentElement.insertBefore(node,

			parentElement.childNodes[index] || null)

	}



	var DELETION = 1

	var INSERTION = 2

	var MOVE = 3



	function handleKeysDiffer(data, existing, cached, parentElement) {

		forKeys(data, function (key, i) {

			existing[key = key.key] = existing[key] ? {

				action: MOVE,

				index: i,

				from: existing[key].index,

				element: cached.nodes[existing[key].index] ||

					$document.createElement("div")

			} : {action: INSERTION, index: i}

		})



		var actions = []

		for (var prop in existing) {

			if (hasOwn.call(existing, prop)) {

				actions.push(existing[prop])

			}

		}



		var changes = actions.sort(sortChanges)

		var newCached = new Array(cached.length)



		newCached.nodes = cached.nodes.slice()



		forEach(changes, function (change) {

			var index = change.index

			if (change.action === DELETION) {

				clear(cached[index].nodes, cached[index])

				newCached.splice(index, 1)

			}

			if (change.action === INSERTION) {

				var dummy = $document.createElement("div")

				dummy.key = data[index].attrs.key

				insertNode(parentElement, dummy, index)

				newCached.splice(index, 0, {

					attrs: {key: data[index].attrs.key},

					nodes: [dummy]

				})

				newCached.nodes[index] = dummy

			}



			if (change.action === MOVE) {

				var changeElement = change.element

				var maybeChanged = parentElement.childNodes[index]

				if (maybeChanged !== changeElement && changeElement !== null) {

					parentElement.insertBefore(changeElement,

						maybeChanged || null)

				}

				newCached[index] = cached[change.from]

				newCached.nodes[index] = changeElement

			}

		})



		return newCached

	}



	function diffKeys(data, cached, existing, parentElement) {

		var keysDiffer = data.length !== cached.length



		if (!keysDiffer) {

			forKeys(data, function (attrs, i) {

				var cachedCell = cached[i]

				return keysDiffer = cachedCell &&

					cachedCell.attrs &&

					cachedCell.attrs.key !== attrs.key

			})

		}



		if (keysDiffer) {

			return handleKeysDiffer(data, existing, cached, parentElement)

		} else {

			return cached

		}

	}



	function diffArray(data, cached, nodes) {

		// diff the array itself



		// update the list of DOM nodes by collecting the nodes from each item

		forEach(data, function (_, i) {

			if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)

		})

		// remove items from the end of the array if the new array is shorter

		// than the old one. if errors ever happen here, the issue is most

		// likely a bug in the construction of the `cached` data structure

		// somewhere earlier in the program

		forEach(cached.nodes, function (node, i) {

			if (node.parentNode != null && nodes.indexOf(node) < 0) {

				clear([node], [cached[i]])

			}

		})



		if (data.length < cached.length) cached.length = data.length

		cached.nodes = nodes

	}



	function buildArrayKeys(data) {

		var guid = 0

		forKeys(data, function () {

			forEach(data, function (attrs) {

				if ((attrs = attrs && attrs.attrs) && attrs.key == null) {

					attrs.key = "__mithril__" + guid++

				}

			})

			return 1

		})

	}



	function isDifferentEnough(data, cached, dataAttrKeys) {

		if (data.tag !== cached.tag) return true



		if (dataAttrKeys.sort().join() !==

				Object.keys(cached.attrs).sort().join()) {

			return true

		}



		if (data.attrs.id !== cached.attrs.id) {

			return true

		}



		if (data.attrs.key !== cached.attrs.key) {

			return true

		}



		if (m.redraw.strategy() === "all") {

			return !cached.configContext || cached.configContext.retain !== true

		}



		if (m.redraw.strategy() === "diff") {

			return cached.configContext && cached.configContext.retain === false

		}



		return false

	}



	function maybeRecreateObject(data, cached, dataAttrKeys) {

		// if an element is different enough from the one in cache, recreate it

		if (isDifferentEnough(data, cached, dataAttrKeys)) {

			if (cached.nodes.length) clear(cached.nodes)



			if (cached.configContext &&

					isFunction(cached.configContext.onunload)) {

				cached.configContext.onunload()

			}



			if (cached.controllers) {

				forEach(cached.controllers, function (controller) {

					if (controller.onunload) {

						controller.onunload({preventDefault: noop})

					}

				})

			}

		}

	}



	function getObjectNamespace(data, namespace) {

		if (data.attrs.xmlns) return data.attrs.xmlns

		if (data.tag === "svg") return "http://www.w3.org/2000/svg"

		if (data.tag === "math") return "http://www.w3.org/1998/Math/MathML"

		return namespace

	}



	var pendingRequests = 0

	m.startComputation = function () { pendingRequests++ }

	m.endComputation = function () {

		if (pendingRequests > 1) {

			pendingRequests--

		} else {

			pendingRequests = 0

			m.redraw()

		}

	}



	function unloadCachedControllers(cached, views, controllers) {

		if (controllers.length) {

			cached.views = views

			cached.controllers = controllers

			forEach(controllers, function (controller) {

				if (controller.onunload && controller.onunload.$old) {

					controller.onunload = controller.onunload.$old

				}



				if (pendingRequests && controller.onunload) {

					var onunload = controller.onunload

					controller.onunload = noop

					controller.onunload.$old = onunload

				}

			})

		}

	}



	function scheduleConfigsToBeCalled(configs, data, node, isNew, cached) {

		// schedule configs to be called. They are called after `build` finishes

		// running

		if (isFunction(data.attrs.config)) {

			var context = cached.configContext = cached.configContext || {}



			// bind

			configs.push(function () {

				return data.attrs.config.call(data, node, !isNew, context,

					cached)

			})

		}

	}



	function buildUpdatedNode(

		cached,

		data,

		editable,

		hasKeys,

		namespace,

		views,

		configs,

		controllers

	) {

		var node = cached.nodes[0]



		if (hasKeys) {

			setAttributes(node, data.tag, data.attrs, cached.attrs, namespace)

		}



		cached.children = build(

			node,

			data.tag,

			undefined,

			undefined,

			data.children,

			cached.children,

			false,

			0,

			data.attrs.contenteditable ? node : editable,

			namespace,

			configs

		)



		cached.nodes.intact = true



		if (controllers.length) {

			cached.views = views

			cached.controllers = controllers

		}



		return node

	}



	function handleNonexistentNodes(data, parentElement, index) {

		var nodes

		if (data.$trusted) {

			nodes = injectHTML(parentElement, index, data)

		} else {

			nodes = [$document.createTextNode(data)]

			if (!(parentElement.nodeName in voidElements)) {

				insertNode(parentElement, nodes[0], index)

			}

		}



		var cached



		if (typeof data === "string" ||

				typeof data === "number" ||

				typeof data === "boolean") {

			cached = new data.constructor(data)

		} else {

			cached = data

		}



		cached.nodes = nodes

		return cached

	}



	function reattachNodes(

		data,

		cached,

		parentElement,

		editable,

		index,

		parentTag

	) {

		var nodes = cached.nodes

		if (!editable || editable !== $document.activeElement) {

			if (data.$trusted) {

				clear(nodes, cached)

				nodes = injectHTML(parentElement, index, data)

			} else if (parentTag === "textarea") {

				// <textarea> uses `value` instead of `nodeValue`.

				parentElement.value = data

			} else if (editable) {

				// contenteditable nodes use `innerHTML` instead of `nodeValue`.

				editable.innerHTML = data

			} else {

				// was a trusted string

				if (nodes[0].nodeType === 1 || nodes.length > 1 ||

						(nodes[0].nodeValue.trim &&

							!nodes[0].nodeValue.trim())) {

					clear(cached.nodes, cached)

					nodes = [$document.createTextNode(data)]

				}



				injectTextNode(parentElement, nodes[0], index, data)

			}

		}

		cached = new data.constructor(data)

		cached.nodes = nodes

		return cached

	}



	function handleTextNode(

		cached,

		data,

		index,

		parentElement,

		shouldReattach,

		editable,

		parentTag

	) {

		if (!cached.nodes.length) {

			return handleNonexistentNodes(data, parentElement, index)

		} else if (cached.valueOf() !== data.valueOf() || shouldReattach) {

			return reattachNodes(data, cached, parentElement, editable, index,

				parentTag)

		} else {

			return (cached.nodes.intact = true, cached)

		}

	}



	function getSubArrayCount(item) {

		if (item.$trusted) {

			// fix offset of next element if item was a trusted string w/ more

			// than one html element

			// the first clause in the regexp matches elements

			// the second clause (after the pipe) matches text nodes

			var match = item.match(/<[^\/]|\>\s*[^<]/g)

			if (match != null) return match.length

		} else if (isArray(item)) {

			return item.length

		}

		return 1

	}



	function buildArray(

		data,

		cached,

		parentElement,

		index,

		parentTag,

		shouldReattach,

		editable,

		namespace,

		configs

	) {

		data = flatten(data)

		var nodes = []

		var intact = cached.length === data.length

		var subArrayCount = 0



		// keys algorithm: sort elements without recreating them if keys are

		// present

		//

		// 1) create a map of all existing keys, and mark all for deletion

		// 2) add new keys to map and mark them for addition

		// 3) if key exists in new list, change action from deletion to a move

		// 4) for each key, handle its corresponding action as marked in

		//    previous steps



		var existing = {}

		var shouldMaintainIdentities = false



		forKeys(cached, function (attrs, i) {

			shouldMaintainIdentities = true

			existing[cached[i].attrs.key] = {action: DELETION, index: i}

		})



		buildArrayKeys(data)

		if (shouldMaintainIdentities) {

			cached = diffKeys(data, cached, existing, parentElement)

		}

		// end key algorithm



		var cacheCount = 0

		// faster explicitly written

		for (var i = 0, len = data.length; i < len; i++) {

			// diff each item in the array

			var item = build(

				parentElement,

				parentTag,

				cached,

				index,

				data[i],

				cached[cacheCount],

				shouldReattach,

				index + subArrayCount || subArrayCount,

				editable,

				namespace,

				configs)



			if (item !== undefined) {

				intact = intact && item.nodes.intact

				subArrayCount += getSubArrayCount(item)

				cached[cacheCount++] = item

			}

		}



		if (!intact) diffArray(data, cached, nodes)

		return cached

	}



	function makeCache(data, cached, index, parentIndex, parentCache) {

		if (cached != null) {

			if (type.call(cached) === type.call(data)) return cached



			if (parentCache && parentCache.nodes) {

				var offset = index - parentIndex

				var end = offset + (isArray(data) ? data : cached.nodes).length

				clear(

					parentCache.nodes.slice(offset, end),

					parentCache.slice(offset, end))

			} else if (cached.nodes) {

				clear(cached.nodes, cached)

			}

		}



		cached = new data.constructor()

		// if constructor creates a virtual dom element, use a blank object as

		// the base cached node instead of copying the virtual el (#277)

		if (cached.tag) cached = {}

		cached.nodes = []

		return cached

	}



	function constructNode(data, namespace) {

		if (data.attrs.is) {

			if (namespace == null) {

				return $document.createElement(data.tag, data.attrs.is)

			} else {

				return $document.createElementNS(namespace, data.tag,

					data.attrs.is)

			}

		} else if (namespace == null) {

			return $document.createElement(data.tag)

		} else {

			return $document.createElementNS(namespace, data.tag)

		}

	}



	function constructAttrs(data, node, namespace, hasKeys) {

		if (hasKeys) {

			return setAttributes(node, data.tag, data.attrs, {}, namespace)

		} else {

			return data.attrs

		}

	}



	function constructChildren(

		data,

		node,

		cached,

		editable,

		namespace,

		configs

	) {

		if (data.children != null && data.children.length > 0) {

			return build(

				node,

				data.tag,

				undefined,

				undefined,

				data.children,

				cached.children,

				true,

				0,

				data.attrs.contenteditable ? node : editable,

				namespace,

				configs)

		} else {

			return data.children

		}

	}



	function reconstructCached(

		data,

		attrs,

		children,

		node,

		namespace,

		views,

		controllers

	) {

		var cached = {

			tag: data.tag,

			attrs: attrs,

			children: children,

			nodes: [node]

		}



		unloadCachedControllers(cached, views, controllers)



		if (cached.children && !cached.children.nodes) {

			cached.children.nodes = []

		}



		// edge case: setting value on <select> doesn't work before children

		// exist, so set it again after children have been created

		if (data.tag === "select" && "value" in data.attrs) {

			setAttributes(node, data.tag, {value: data.attrs.value}, {},

				namespace)

		}



		return cached

	}



	function getController(views, view, cachedControllers, controller) {

		var controllerIndex



		if (m.redraw.strategy() === "diff" && views) {

			controllerIndex = views.indexOf(view)

		} else {

			controllerIndex = -1

		}



		if (controllerIndex > -1) {

			return cachedControllers[controllerIndex]

		} else if (isFunction(controller)) {

			return new controller()

		} else {

			return {}

		}

	}



	var unloaders = []



	function updateLists(views, controllers, view, controller) {

		if (controller.onunload != null &&

				unloaders.map(function (u) { return u.handler })

					.indexOf(controller.onunload) < 0) {

			unloaders.push({

				controller: controller,

				handler: controller.onunload

			})

		}



		views.push(view)

		controllers.push(controller)

	}



	var forcing = false

	function checkView(

		data,

		view,

		cached,

		cachedControllers,

		controllers,

		views

	) {

		var controller = getController(

			cached.views,

			view,

			cachedControllers,

			data.controller)



		var key = data && data.attrs && data.attrs.key



		if (pendingRequests === 0 ||

				forcing ||

				cachedControllers &&

					cachedControllers.indexOf(controller) > -1) {

			data = data.view(controller)

		} else {

			data = {tag: "placeholder"}

		}



		if (data.subtree === "retain") return data

		data.attrs = data.attrs || {}

		data.attrs.key = key

		updateLists(views, controllers, view, controller)

		return data

	}



	function markViews(data, cached, views, controllers) {

		var cachedControllers = cached && cached.controllers



		while (data.view != null) {

			data = checkView(

				data,

				data.view.$original || data.view,

				cached,

				cachedControllers,

				controllers,

				views)

		}



		return data

	}



	function buildObject( // eslint-disable-line max-statements

		data,

		cached,

		editable,

		parentElement,

		index,

		shouldReattach,

		namespace,

		configs

	) {

		var views = []

		var controllers = []



		data = markViews(data, cached, views, controllers)



		if (data.subtree === "retain") return cached



		if (!data.tag && controllers.length) {

			throw new Error("Component template must return a virtual " +

				"element, not an array, string, etc.")

		}



		data.attrs = data.attrs || {}

		cached.attrs = cached.attrs || {}



		var dataAttrKeys = Object.keys(data.attrs)

		var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)



		maybeRecreateObject(data, cached, dataAttrKeys)



		if (!isString(data.tag)) return



		var isNew = cached.nodes.length === 0



		namespace = getObjectNamespace(data, namespace)



		var node

		if (isNew) {

			node = constructNode(data, namespace)

			// set attributes first, then create children

			var attrs = constructAttrs(data, node, namespace, hasKeys)



			var children = constructChildren(data, node, cached, editable,

				namespace, configs)



			cached = reconstructCached(

				data,

				attrs,

				children,

				node,

				namespace,

				views,

				controllers)

		} else {

			node = buildUpdatedNode(

				cached,

				data,

				editable,

				hasKeys,

				namespace,

				views,

				configs,

				controllers)

		}



		if (isNew || shouldReattach === true && node != null) {

			insertNode(parentElement, node, index)

		}



		// The configs are called after `build` finishes running

		scheduleConfigsToBeCalled(configs, data, node, isNew, cached)



		return cached

	}



	function build(

		parentElement,

		parentTag,

		parentCache,

		parentIndex,

		data,

		cached,

		shouldReattach,

		index,

		editable,

		namespace,

		configs

	) {

		/*

		 * `build` is a recursive function that manages creation/diffing/removal

		 * of DOM elements based on comparison between `data` and `cached` the

		 * diff algorithm can be summarized as this:

		 *

		 * 1 - compare `data` and `cached`

		 * 2 - if they are different, copy `data` to `cached` and update the DOM

		 *     based on what the difference is

		 * 3 - recursively apply this algorithm for every array and for the

		 *     children of every virtual element

		 *

		 * The `cached` data structure is essentially the same as the previous

		 * redraw's `data` data structure, with a few additions:

		 * - `cached` always has a property called `nodes`, which is a list of

		 *    DOM elements that correspond to the data represented by the

		 *    respective virtual element

		 * - in order to support attaching `nodes` as a property of `cached`,

		 *    `cached` is *always* a non-primitive object, i.e. if the data was

		 *    a string, then cached is a String instance. If data was `null` or

		 *    `undefined`, cached is `new String("")`

		 * - `cached also has a `configContext` property, which is the state

		 *    storage object exposed by config(element, isInitialized, context)

		 * - when `cached` is an Object, it represents a virtual element; when

		 *    it's an Array, it represents a list of elements; when it's a

		 *    String, Number or Boolean, it represents a text node

		 *

		 * `parentElement` is a DOM element used for W3C DOM API calls

		 * `parentTag` is only used for handling a corner case for textarea

		 * values

		 * `parentCache` is used to remove nodes in some multi-node cases

		 * `parentIndex` and `index` are used to figure out the offset of nodes.

		 * They're artifacts from before arrays started being flattened and are

		 * likely refactorable

		 * `data` and `cached` are, respectively, the new and old nodes being

		 * diffed

		 * `shouldReattach` is a flag indicating whether a parent node was

		 * recreated (if so, and if this node is reused, then this node must

		 * reattach itself to the new parent)

		 * `editable` is a flag that indicates whether an ancestor is

		 * contenteditable

		 * `namespace` indicates the closest HTML namespace as it cascades down

		 * from an ancestor

		 * `configs` is a list of config functions to run after the topmost

		 * `build` call finishes running

		 *

		 * there's logic that relies on the assumption that null and undefined

		 * data are equivalent to empty strings

		 * - this prevents lifecycle surprises from procedural helpers that mix

		 *   implicit and explicit return statements (e.g.

		 *   function foo() {if (cond) return m("div")}

		 * - it simplifies diffing code

		 */

		data = dataToString(data)

		if (data.subtree === "retain") return cached

		cached = makeCache(data, cached, index, parentIndex, parentCache)



		if (isArray(data)) {

			return buildArray(

				data,

				cached,

				parentElement,

				index,

				parentTag,

				shouldReattach,

				editable,

				namespace,

				configs)

		} else if (data != null && isObject(data)) {

			return buildObject(

				data,

				cached,

				editable,

				parentElement,

				index,

				shouldReattach,

				namespace,

				configs)

		} else if (!isFunction(data)) {

			return handleTextNode(

				cached,

				data,

				index,

				parentElement,

				shouldReattach,

				editable,

				parentTag)

		} else {

			return cached

		}

	}



	function sortChanges(a, b) {

		return a.action - b.action || a.index - b.index

	}



	function copyStyleAttrs(node, dataAttr, cachedAttr) {

		for (var rule in dataAttr) {

			if (hasOwn.call(dataAttr, rule)) {

				if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) {

					node.style[rule] = dataAttr[rule]

				}

			}

		}



		for (rule in cachedAttr) {

			if (hasOwn.call(cachedAttr, rule)) {

				if (!hasOwn.call(dataAttr, rule)) node.style[rule] = ""

			}

		}

	}



	var shouldUseSetAttribute = {

		list: 1,

		style: 1,

		form: 1,

		type: 1,

		width: 1,

		height: 1

	}



	function setSingleAttr(

		node,

		attrName,

		dataAttr,

		cachedAttr,

		tag,

		namespace

	) {

		if (attrName === "config" || attrName === "key") {

			// `config` isn't a real attribute, so ignore it

			return true

		} else if (isFunction(dataAttr) && attrName.slice(0, 2) === "on") {

			// hook event handlers to the auto-redrawing system

			node[attrName] = autoredraw(dataAttr, node)

		} else if (attrName === "style" && dataAttr != null &&

				isObject(dataAttr)) {

			// handle `style: {...}`

			copyStyleAttrs(node, dataAttr, cachedAttr)

		} else if (namespace != null) {

			// handle SVG

			if (attrName === "href") {

				node.setAttributeNS("http://www.w3.org/1999/xlink",

					"href", dataAttr)

			} else {

				node.setAttribute(

					attrName === "className" ? "class" : attrName,

					dataAttr)

			}

		} else if (attrName in node && !shouldUseSetAttribute[attrName]) {

			// handle cases that are properties (but ignore cases where we

			// should use setAttribute instead)

			//

			// - list and form are typically used as strings, but are DOM

			//   element references in js

			//

			// - when using CSS selectors (e.g. `m("[style='']")`), style is

			//   used as a string, but it's an object in js

			//

			// #348 don't set the value if not needed - otherwise, cursor

			// placement breaks in Chrome

			try {

				if (tag !== "input" || node[attrName] !== dataAttr) {

					node[attrName] = dataAttr

				}

			} catch (e) {

				node.setAttribute(attrName, dataAttr)

			}

		}

		else node.setAttribute(attrName, dataAttr)

	}



	function trySetAttr(

		node,

		attrName,

		dataAttr,

		cachedAttr,

		cachedAttrs,

		tag,

		namespace

	) {

		if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {

			cachedAttrs[attrName] = dataAttr

			try {

				return setSingleAttr(

					node,

					attrName,

					dataAttr,

					cachedAttr,

					tag,

					namespace)

			} catch (e) {

				// swallow IE's invalid argument errors to mimic HTML's

				// fallback-to-doing-nothing-on-invalid-attributes behavior

				if (e.message.indexOf("Invalid argument") < 0) throw e

			}

		} else if (attrName === "value" && tag === "input" &&

				node.value !== dataAttr) {

			// #348 dataAttr may not be a string, so use loose comparison

			node.value = dataAttr

		}

	}



	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {

		for (var attrName in dataAttrs) {

			if (hasOwn.call(dataAttrs, attrName)) {

				if (trySetAttr(

						node,

						attrName,

						dataAttrs[attrName],

						cachedAttrs[attrName],

						cachedAttrs,

						tag,

						namespace)) {

					continue

				}

			}

		}

		return cachedAttrs

	}



	function clear(nodes, cached) {

		for (var i = nodes.length - 1; i > -1; i--) {

			if (nodes[i] && nodes[i].parentNode) {

				try {

					nodes[i].parentNode.removeChild(nodes[i])

				} catch (e) {

					/* eslint-disable max-len */

					// ignore if this fails due to order of events (see

					// http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)

					/* eslint-enable max-len */

				}

				cached = [].concat(cached)

				if (cached[i]) unload(cached[i])

			}

		}

		// release memory if nodes is an array. This check should fail if nodes

		// is a NodeList (see loop above)

		if (nodes.length) {

			nodes.length = 0

		}

	}



	function unload(cached) {

		if (cached.configContext && isFunction(cached.configContext.onunload)) {

			cached.configContext.onunload()

			cached.configContext.onunload = null

		}

		if (cached.controllers) {

			forEach(cached.controllers, function (controller) {

				if (isFunction(controller.onunload)) {

					controller.onunload({preventDefault: noop})

				}

			})

		}

		if (cached.children) {

			if (isArray(cached.children)) forEach(cached.children, unload)

			else if (cached.children.tag) unload(cached.children)

		}

	}



	function appendTextFragment(parentElement, data) {

		try {

			parentElement.appendChild(

				$document.createRange().createContextualFragment(data))

		} catch (e) {

			parentElement.insertAdjacentHTML("beforeend", data)

		}

	}



	function injectHTML(parentElement, index, data) {

		var nextSibling = parentElement.childNodes[index]

		if (nextSibling) {

			var isElement = nextSibling.nodeType !== 1

			var placeholder = $document.createElement("span")

			if (isElement) {

				parentElement.insertBefore(placeholder, nextSibling || null)

				placeholder.insertAdjacentHTML("beforebegin", data)

				parentElement.removeChild(placeholder)

			} else {

				nextSibling.insertAdjacentHTML("beforebegin", data)

			}

		} else {

			appendTextFragment(parentElement, data)

		}



		var nodes = []



		while (parentElement.childNodes[index] !== nextSibling) {

			nodes.push(parentElement.childNodes[index])

			index++

		}



		return nodes

	}



	function autoredraw(callback, object) {

		return function (e) {

			e = e || event

			m.redraw.strategy("diff")

			m.startComputation()

			try {

				return callback.call(object, e)

			} finally {

				endFirstComputation()

			}

		}

	}



	var html

	var documentNode = {

		appendChild: function (node) {

			if (html === undefined) html = $document.createElement("html")

			if ($document.documentElement &&

					$document.documentElement !== node) {

				$document.replaceChild(node, $document.documentElement)

			} else {

				$document.appendChild(node)

			}



			this.childNodes = $document.childNodes

		},



		insertBefore: function (node) {

			this.appendChild(node)

		},



		childNodes: []

	}



	var nodeCache = []

	var cellCache = {}



	m.render = function (root, cell, forceRecreation) {

		if (!root) {

			throw new Error("Ensure the DOM element being passed to " +

				"m.route/m.mount/m.render is not undefined.")

		}

		var configs = []

		var id = getCellCacheKey(root)

		var isDocumentRoot = root === $document

		var node



		if (isDocumentRoot || root === $document.documentElement) {

			node = documentNode

		} else {

			node = root

		}



		if (isDocumentRoot && cell.tag !== "html") {

			cell = {tag: "html", attrs: {}, children: cell}

		}



		if (cellCache[id] === undefined) clear(node.childNodes)

		if (forceRecreation === true) reset(root)



		cellCache[id] = build(

			node,

			null,

			undefined,

			undefined,

			cell,

			cellCache[id],

			false,

			0,

			null,

			undefined,

			configs)



		forEach(configs, function (config) { config() })

	}



	function getCellCacheKey(element) {

		var index = nodeCache.indexOf(element)

		return index < 0 ? nodeCache.push(element) - 1 : index

	}



	m.trust = function (value) {

		value = new String(value) // eslint-disable-line no-new-wrappers

		value.$trusted = true

		return value

	}



	function gettersetter(store) {

		function prop() {

			if (arguments.length) store = arguments[0]

			return store

		}



		prop.toJSON = function () {

			return store

		}



		return prop

	}



	m.prop = function (store) {

		if ((store != null && isObject(store) || isFunction(store)) &&

				isFunction(store.then)) {

			return propify(store)

		}



		return gettersetter(store)

	}



	var roots = []

	var components = []

	var controllers = []

	var lastRedrawId = null

	var lastRedrawCallTime = 0

	var computePreRedrawHook = null

	var computePostRedrawHook = null

	var topComponent

	var FRAME_BUDGET = 16 // 60 frames per second = 1 call per 16 ms



	function parameterize(component, args) {

		function controller() {

			/* eslint-disable no-invalid-this */

			return (component.controller || noop).apply(this, args) || this

			/* eslint-enable no-invalid-this */

		}



		if (component.controller) {

			controller.prototype = component.controller.prototype

		}



		function view(ctrl) {

			var currentArgs = [ctrl].concat(args)

			for (var i = 1; i < arguments.length; i++) {

				currentArgs.push(arguments[i])

			}



			return component.view.apply(component, currentArgs)

		}



		view.$original = component.view

		var output = {controller: controller, view: view}

		if (args[0] && args[0].key != null) output.attrs = {key: args[0].key}

		return output

	}



	m.component = function (component) {

		var args = new Array(arguments.length - 1)



		for (var i = 1; i < arguments.length; i++) {

			args[i - 1] = arguments[i]

		}



		return parameterize(component, args)

	}



	function checkPrevented(component, root, index, isPrevented) {

		if (!isPrevented) {

			m.redraw.strategy("all")

			m.startComputation()

			roots[index] = root

			var currentComponent



			if (component) {

				currentComponent = topComponent = component

			} else {

				currentComponent = topComponent = component = {controller: noop}

			}



			var controller = new (component.controller || noop)()



			// controllers may call m.mount recursively (via m.route redirects,

			// for example)

			// this conditional ensures only the last recursive m.mount call is

			// applied

			if (currentComponent === topComponent) {

				controllers[index] = controller

				components[index] = component

			}

			endFirstComputation()

			if (component === null) {

				removeRootElement(root, index)

			}

			return controllers[index]

		} else if (component == null) {

			removeRootElement(root, index)

		}

	}



	m.mount = m.module = function (root, component) {

		if (!root) {

			throw new Error("Please ensure the DOM element exists before " +

				"rendering a template into it.")

		}



		var index = roots.indexOf(root)

		if (index < 0) index = roots.length



		var isPrevented = false

		var event = {

			preventDefault: function () {

				isPrevented = true

				computePreRedrawHook = computePostRedrawHook = null

			}

		}



		forEach(unloaders, function (unloader) {

			unloader.handler.call(unloader.controller, event)

			unloader.controller.onunload = null

		})



		if (isPrevented) {

			forEach(unloaders, function (unloader) {

				unloader.controller.onunload = unloader.handler

			})

		} else {

			unloaders = []

		}



		if (controllers[index] && isFunction(controllers[index].onunload)) {

			controllers[index].onunload(event)

		}



		return checkPrevented(component, root, index, isPrevented)

	}



	function removeRootElement(root, index) {

		roots.splice(index, 1)

		controllers.splice(index, 1)

		components.splice(index, 1)

		reset(root)

		nodeCache.splice(getCellCacheKey(root), 1)

	}



	var redrawing = false

	m.redraw = function (force) {

		if (redrawing) return

		redrawing = true

		if (force) forcing = true



		try {

			// lastRedrawId is a positive number if a second redraw is requested

			// before the next animation frame

			// lastRedrawId is null if it's the first redraw and not an event

			// handler

			if (lastRedrawId && !force) {

				// when setTimeout: only reschedule redraw if time between now

				// and previous redraw is bigger than a frame, otherwise keep

				// currently scheduled timeout

				// when rAF: always reschedule redraw

				if ($requestAnimationFrame === global.requestAnimationFrame ||

						new Date() - lastRedrawCallTime > FRAME_BUDGET) {

					if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId)

					lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)

				}

			} else {

				redraw()

				lastRedrawId = $requestAnimationFrame(function () {

					lastRedrawId = null

				}, FRAME_BUDGET)

			}

		} finally {

			redrawing = forcing = false

		}

	}



	m.redraw.strategy = m.prop()

	function redraw() {

		if (computePreRedrawHook) {

			computePreRedrawHook()

			computePreRedrawHook = null

		}

		forEach(roots, function (root, i) {

			var component = components[i]

			if (controllers[i]) {

				var args = [controllers[i]]

				m.render(root,

					component.view ? component.view(controllers[i], args) : "")

			}

		})

		// after rendering within a routed context, we need to scroll back to

		// the top, and fetch the document title for history.pushState

		if (computePostRedrawHook) {

			computePostRedrawHook()

			computePostRedrawHook = null

		}

		lastRedrawId = null

		lastRedrawCallTime = new Date()

		m.redraw.strategy("diff")

	}



	function endFirstComputation() {

		if (m.redraw.strategy() === "none") {

			pendingRequests--

			m.redraw.strategy("diff")

		} else {

			m.endComputation()

		}

	}



	m.withAttr = function (prop, withAttrCallback, callbackThis) {

		return function (e) {

			e = e || window.event

			/* eslint-disable no-invalid-this */

			var currentTarget = e.currentTarget || this

			var _this = callbackThis || this

			/* eslint-enable no-invalid-this */

			var target = prop in currentTarget ?

				currentTarget[prop] :

				currentTarget.getAttribute(prop)

			withAttrCallback.call(_this, target)

		}

	}



	// routing

	var modes = {pathname: "", hash: "#", search: "?"}

	var redirect = noop

	var isDefaultRoute = false

	var routeParams, currentRoute



	m.route = function (root, arg1, arg2, vdom) { // eslint-disable-line

		// m.route()

		if (arguments.length === 0) return currentRoute

		// m.route(el, defaultRoute, routes)

		if (arguments.length === 3 && isString(arg1)) {

			redirect = function (source) {

				var path = currentRoute = normalizeRoute(source)

				if (!routeByValue(root, arg2, path)) {

					if (isDefaultRoute) {

						throw new Error("Ensure the default route matches " +

							"one of the routes defined in m.route")

					}



					isDefaultRoute = true

					m.route(arg1, true)

					isDefaultRoute = false

				}

			}



			var listener = m.route.mode === "hash" ?

				"onhashchange" :

				"onpopstate"



			global[listener] = function () {

				var path = $location[m.route.mode]

				if (m.route.mode === "pathname") path += $location.search

				if (currentRoute !== normalizeRoute(path)) redirect(path)

			}



			computePreRedrawHook = setScroll

			global[listener]()



			return

		}



		// config: m.route

		if (root.addEventListener || root.attachEvent) {

			var base = m.route.mode !== "pathname" ? $location.pathname : ""

			root.href = base + modes[m.route.mode] + vdom.attrs.href

			if (root.addEventListener) {

				root.removeEventListener("click", routeUnobtrusive)

				root.addEventListener("click", routeUnobtrusive)

			} else {

				root.detachEvent("onclick", routeUnobtrusive)

				root.attachEvent("onclick", routeUnobtrusive)

			}



			return

		}

		// m.route(route, params, shouldReplaceHistoryEntry)

		if (isString(root)) {

			var oldRoute = currentRoute

			currentRoute = root



			var args = arg1 || {}

			var queryIndex = currentRoute.indexOf("?")

			var params



			if (queryIndex > -1) {

				params = parseQueryString(currentRoute.slice(queryIndex + 1))

			} else {

				params = {}

			}



			for (var i in args) {

				if (hasOwn.call(args, i)) {

					params[i] = args[i]

				}

			}



			var querystring = buildQueryString(params)

			var currentPath



			if (queryIndex > -1) {

				currentPath = currentRoute.slice(0, queryIndex)

			} else {

				currentPath = currentRoute

			}



			if (querystring) {

				currentRoute = currentPath +

					(currentPath.indexOf("?") === -1 ? "?" : "&") +

					querystring

			}



			var replaceHistory =

				(arguments.length === 3 ? arg2 : arg1) === true ||

				oldRoute === root



			if (global.history.pushState) {

				var method = replaceHistory ? "replaceState" : "pushState"

				computePreRedrawHook = setScroll

				computePostRedrawHook = function () {

					global.history[method](null, $document.title,

						modes[m.route.mode] + currentRoute)

				}

				redirect(modes[m.route.mode] + currentRoute)

			} else {

				$location[m.route.mode] = currentRoute

				redirect(modes[m.route.mode] + currentRoute)

			}

		}

	}



	m.route.param = function (key) {

		if (!routeParams) {

			throw new Error("You must call m.route(element, defaultRoute, " +

				"routes) before calling m.route.param()")

		}



		if (!key) {

			return routeParams

		}



		return routeParams[key]

	}



	m.route.mode = "search"



	function normalizeRoute(route) {

		return route.slice(modes[m.route.mode].length)

	}



	function routeByValue(root, router, path) {

		routeParams = {}



		var queryStart = path.indexOf("?")

		if (queryStart !== -1) {

			routeParams = parseQueryString(

				path.substr(queryStart + 1, path.length))

			path = path.substr(0, queryStart)

		}



		// Get all routes and check if there's

		// an exact match for the current path

		var keys = Object.keys(router)

		var index = keys.indexOf(path)



		if (index !== -1){

			m.mount(root, router[keys [index]])

			return true

		}



		for (var route in router) {

			if (hasOwn.call(router, route)) {

				if (route === path) {

					m.mount(root, router[route])

					return true

				}



				var matcher = new RegExp("^" + route

					.replace(/:[^\/]+?\.{3}/g, "(.*?)")

					.replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")



				if (matcher.test(path)) {

					/* eslint-disable no-loop-func */

					path.replace(matcher, function () {

						var keys = route.match(/:[^\/]+/g) || []

						var values = [].slice.call(arguments, 1, -2)

						forEach(keys, function (key, i) {

							routeParams[key.replace(/:|\./g, "")] =

								decodeURIComponent(values[i])

						})

						m.mount(root, router[route])

					})

					/* eslint-enable no-loop-func */

					return true

				}

			}

		}

	}



	function routeUnobtrusive(e) {

		e = e || event

		if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return



		if (e.preventDefault) {

			e.preventDefault()

		} else {

			e.returnValue = false

		}



		var currentTarget = e.currentTarget || e.srcElement

		var args



		if (m.route.mode === "pathname" && currentTarget.search) {

			args = parseQueryString(currentTarget.search.slice(1))

		} else {

			args = {}

		}



		while (currentTarget && !/a/i.test(currentTarget.nodeName)) {

			currentTarget = currentTarget.parentNode

		}



		// clear pendingRequests because we want an immediate route change

		pendingRequests = 0

		m.route(currentTarget[m.route.mode]

			.slice(modes[m.route.mode].length), args)

	}



	function setScroll() {

		if (m.route.mode !== "hash" && $location.hash) {

			$location.hash = $location.hash

		} else {

			global.scrollTo(0, 0)

		}

	}



	function buildQueryString(object, prefix) {

		var duplicates = {}

		var str = []



		for (var prop in object) {

			if (hasOwn.call(object, prop)) {

				var key = prefix ? prefix + "[" + prop + "]" : prop

				var value = object[prop]



				if (value === null) {

					str.push(encodeURIComponent(key))

				} else if (isObject(value)) {

					str.push(buildQueryString(value, key))

				} else if (isArray(value)) {

					var keys = []

					duplicates[key] = duplicates[key] || {}

					/* eslint-disable no-loop-func */

					forEach(value, function (item) {

						/* eslint-enable no-loop-func */

						if (!duplicates[key][item]) {

							duplicates[key][item] = true

							keys.push(encodeURIComponent(key) + "=" +

								encodeURIComponent(item))

						}

					})

					str.push(keys.join("&"))

				} else if (value !== undefined) {

					str.push(encodeURIComponent(key) + "=" +

						encodeURIComponent(value))

				}

			}

		}



		return str.join("&")

	}



	function parseQueryString(str) {

		if (str === "" || str == null) return {}

		if (str.charAt(0) === "?") str = str.slice(1)



		var pairs = str.split("&")

		var params = {}



		forEach(pairs, function (string) {

			var pair = string.split("=")

			var key = decodeURIComponent(pair[0])

			var value = pair.length === 2 ? decodeURIComponent(pair[1]) : null

			if (params[key] != null) {

				if (!isArray(params[key])) params[key] = [params[key]]

				params[key].push(value)

			}

			else params[key] = value

		})



		return params

	}



	m.route.buildQueryString = buildQueryString

	m.route.parseQueryString = parseQueryString



	function reset(root) {

		var cacheKey = getCellCacheKey(root)

		clear(root.childNodes, cellCache[cacheKey])

		cellCache[cacheKey] = undefined

	}



	m.deferred = function () {

		var deferred = new Deferred()

		deferred.promise = propify(deferred.promise)

		return deferred

	}



	function propify(promise, initialValue) {

		var prop = m.prop(initialValue)

		promise.then(prop)

		prop.then = function (resolve, reject) {

			return propify(promise.then(resolve, reject), initialValue)

		}



		prop.catch = prop.then.bind(null, null)

		return prop

	}

	// Promiz.mithril.js | Zolmeister | MIT

	// a modified version of Promiz.js, which does not conform to Promises/A+

	// for two reasons:

	//

	// 1) `then` callbacks are called synchronously (because setTimeout is too

	//    slow, and the setImmediate polyfill is too big

	//

	// 2) throwing subclasses of Error cause the error to be bubbled up instead

	//    of triggering rejection (because the spec does not account for the

	//    important use case of default browser error handling, i.e. message w/

	//    line number)



	var RESOLVING = 1

	var REJECTING = 2

	var RESOLVED = 3

	var REJECTED = 4



	function Deferred(onSuccess, onFailure) {

		var self = this

		var state = 0

		var promiseValue = 0

		var next = []



		self.promise = {}



		self.resolve = function (value) {

			if (!state) {

				promiseValue = value

				state = RESOLVING



				fire()

			}



			return self

		}



		self.reject = function (value) {

			if (!state) {

				promiseValue = value

				state = REJECTING



				fire()

			}



			return self

		}



		self.promise.then = function (onSuccess, onFailure) {

			var deferred = new Deferred(onSuccess, onFailure)



			if (state === RESOLVED) {

				deferred.resolve(promiseValue)

			} else if (state === REJECTED) {

				deferred.reject(promiseValue)

			} else {

				next.push(deferred)

			}



			return deferred.promise

		}



		function finish(type) {

			state = type || REJECTED

			next.map(function (deferred) {

				if (state === RESOLVED) {

					deferred.resolve(promiseValue)

				} else {

					deferred.reject(promiseValue)

				}

			})

		}



		function thennable(then, success, failure, notThennable) {

			if (((promiseValue != null && isObject(promiseValue)) ||

					isFunction(promiseValue)) && isFunction(then)) {

				try {

					// count protects against abuse calls from spec checker

					var count = 0

					then.call(promiseValue, function (value) {

						if (count++) return

						promiseValue = value

						success()

					}, function (value) {

						if (count++) return

						promiseValue = value

						failure()

					})

				} catch (e) {

					m.deferred.onerror(e)

					promiseValue = e

					failure()

				}

			} else {

				notThennable()

			}

		}



		function fire() {

			// check if it's a thenable

			var then

			try {

				then = promiseValue && promiseValue.then

			} catch (e) {

				m.deferred.onerror(e)

				promiseValue = e

				state = REJECTING

				return fire()

			}



			if (state === REJECTING) {

				m.deferred.onerror(promiseValue)

			}



			thennable(then, function () {

				state = RESOLVING

				fire()

			}, function () {

				state = REJECTING

				fire()

			}, function () {

				try {

					if (state === RESOLVING && isFunction(onSuccess)) {

						promiseValue = onSuccess(promiseValue)

					} else if (state === REJECTING && isFunction(onFailure)) {

						promiseValue = onFailure(promiseValue)

						state = RESOLVING

					}

				} catch (e) {

					m.deferred.onerror(e)

					promiseValue = e

					return finish()

				}



				if (promiseValue === self) {

					promiseValue = TypeError()

					finish()

				} else {

					thennable(then, function () {

						finish(RESOLVED)

					}, finish, function () {

						finish(state === RESOLVING && RESOLVED)

					})

				}

			})

		}

	}



	m.deferred.onerror = function (e) {

		if (type.call(e) === "[object Error]" &&

				!/ Error/.test(e.constructor.toString())) {

			pendingRequests = 0

			throw e

		}

	}



	m.sync = function (args) {

		var deferred = m.deferred()

		var outstanding = args.length

		var results = []

		var method = "resolve"



		function synchronizer(pos, resolved) {

			return function (value) {

				results[pos] = value

				if (!resolved) method = "reject"

				if (--outstanding === 0) {

					deferred.promise(results)

					deferred[method](results)

				}

				return value

			}

		}



		if (args.length > 0) {

			forEach(args, function (arg, i) {

				arg.then(synchronizer(i, true), synchronizer(i, false))

			})

		} else {

			deferred.resolve([])

		}



		return deferred.promise

	}



	function identity(value) { return value }



	function handleJsonp(options) {

		var callbackKey = "mithril_callback_" +

			new Date().getTime() + "_" +

			(Math.round(Math.random() * 1e16)).toString(36)



		var script = $document.createElement("script")



		global[callbackKey] = function (resp) {

			script.parentNode.removeChild(script)

			options.onload({

				type: "load",

				target: {

					responseText: resp

				}

			})

			global[callbackKey] = undefined

		}



		script.onerror = function () {

			script.parentNode.removeChild(script)



			options.onerror({

				type: "error",

				target: {

					status: 500,

					responseText: JSON.stringify({

						error: "Error making jsonp request"

					})

				}

			})

			global[callbackKey] = undefined



			return false

		}



		script.onload = function () {

			return false

		}



		script.src = options.url +

			(options.url.indexOf("?") > 0 ? "&" : "?") +

			(options.callbackKey ? options.callbackKey : "callback") +

			"=" + callbackKey +

			"&" + buildQueryString(options.data || {})



		$document.body.appendChild(script)

	}



	function createXhr(options) {

		var xhr = new global.XMLHttpRequest()

		xhr.open(options.method, options.url, true, options.user,

			options.password)



		xhr.onreadystatechange = function () {

			if (xhr.readyState === 4) {

				if (xhr.status >= 200 && xhr.status < 300) {

					options.onload({type: "load", target: xhr})

				} else {

					options.onerror({type: "error", target: xhr})

				}

			}

		}



		if (options.serialize === JSON.stringify &&

				options.data &&

				options.method !== "GET") {

			xhr.setRequestHeader("Content-Type",

				"application/json; charset=utf-8")

		}



		if (options.deserialize === JSON.parse) {

			xhr.setRequestHeader("Accept", "application/json, text/*")

		}



		if (isFunction(options.config)) {

			var maybeXhr = options.config(xhr, options)

			if (maybeXhr != null) xhr = maybeXhr

		}



		var data = options.method === "GET" || !options.data ? "" : options.data



		if (data && !isString(data) && data.constructor !== global.FormData) {

			throw new Error("Request data should be either be a string or " +

				"FormData. Check the `serialize` option in `m.request`")

		}



		xhr.send(data)

		return xhr

	}



	function ajax(options) {

		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {

			return handleJsonp(options)

		} else {

			return createXhr(options)

		}

	}



	function bindData(options, data, serialize) {

		if (options.method === "GET" && options.dataType !== "jsonp") {

			var prefix = options.url.indexOf("?") < 0 ? "?" : "&"

			var querystring = buildQueryString(data)

			options.url += (querystring ? prefix + querystring : "")

		} else {

			options.data = serialize(data)

		}

	}



	function parameterizeUrl(url, data) {

		if (data) {

			url = url.replace(/:[a-z]\w+/gi, function (token){

				var key = token.slice(1)

				var value = data[key]

				delete data[key]

				return value

			})

		}

		return url

	}



	m.request = function (options) {

		if (options.background !== true) m.startComputation()

		var deferred = new Deferred()

		var isJSONP = options.dataType &&

			options.dataType.toLowerCase() === "jsonp"



		var serialize, deserialize, extract



		if (isJSONP) {

			serialize = options.serialize =

			deserialize = options.deserialize = identity



			extract = function (jsonp) { return jsonp.responseText }

		} else {

			serialize = options.serialize = options.serialize || JSON.stringify



			deserialize = options.deserialize =

				options.deserialize || JSON.parse

			extract = options.extract || function (xhr) {

				if (xhr.responseText.length || deserialize !== JSON.parse) {

					return xhr.responseText

				} else {

					return null

				}

			}

		}



		options.method = (options.method || "GET").toUpperCase()

		options.url = parameterizeUrl(options.url, options.data)

		bindData(options, options.data, serialize)

		options.onload = options.onerror = function (ev) {

			try {

				ev = ev || event

				var response = deserialize(extract(ev.target, options))

				if (ev.type === "load") {

					if (options.unwrapSuccess) {

						response = options.unwrapSuccess(response, ev.target)

					}



					if (isArray(response) && options.type) {

						forEach(response, function (res, i) {

							response[i] = new options.type(res)

						})

					} else if (options.type) {

						response = new options.type(response)

					}



					deferred.resolve(response)

				} else {

					if (options.unwrapError) {

						response = options.unwrapError(response, ev.target)

					}



					deferred.reject(response)

				}

			} catch (e) {

				deferred.reject(e)

				m.deferred.onerror(e)

			} finally {

				if (options.background !== true) m.endComputation()

			}

		}



		ajax(options)

		deferred.promise = propify(deferred.promise, options.initialValue)

		return deferred.promise

	}



	return m

}); // eslint-disable-line


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJodG1sL3NwYWNlLmpzIiwibm9kZV9tb2R1bGVzL21pdGhyaWwvbWl0aHJpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBjaGFuZ2UgRk9SV0FSRF9TUEVFRCB0byBjaGFuZ2UgdGhlIHNwZWVkIG9mIHRoZSBzcGFjZXNoaXAgKj9cblRPRE8sIGF0IHNvbWUgcG9pbnQgdGhlIGNvZGUgbmVlZCB0byBiZSByZWZhY3RvcmVkIHRvIGFuIG9iaiwgc28gaXQgaXMgbm90IGluIHRoZSBnbG9iYWwgc2NvYXAuIE9yIHNob3VsZCBpdD8gSXQgaXMgbmljZSB0byBoYXZlIHNvbWUgZ2xvYmFsIHZhcmlhYmxlcyB0aGF0IGNhbiBiZSBhY2Nlc3NlZCBmcm9tIGFueSB3aGVyZS4gSSBndWVzcyBldmVudHVhbGx5IHRoaXMgc2hvdWxkIGNvbnN0LCBidXQgc2luY2UgRVM2IGlzIG5vdCB5ZXQgY3VycmVudGx5IHdpZGVseSBzdXBwb3J0ZWQgaW4gdGhlIGJyb3dzZXIsIEkgaGFkIHRvIHJlc29ydCB0byB0aGlzIGtpbmQgb2YgbmFtaW5nIGNvbnZlbnRpb24gY29tcHJtaXNlISAoOilcbmh0dHBzOi8vYXBpLmlwaWZ5Lm9yZz9mb3JtYXQ9anNvblxuKi9cbnZhciBGT1JXQVJEX1NQRUVEID0gMTU7XG52YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxuXG52YXIgc3BhY2VCb29rVXNlcnMgPSBbXTtcbi8qXG4gICAgICB2YXIgdXJsID0gXCJodHRwczovL3NwYWNlYm9vay5udS91c2Vycy5qc29uXCI7XG4gICAgICAvLyBObyBuZWVkIGZvciBtLnByb3Agc2luY2UgbS5yZXF1ZXN0IHJldHVybnMgYSBHZXR0ZXJTZXR0ZXIgdG9vXG4gICAgICB2YXIgc3BhY2VCb29rVXNlcnMgPSBtLnJlcXVlc3Qoe1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJsOiB1cmxcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHVzZXJzQXJyYXkpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInVzZXIgYWxtb3N0IGZpbGxlZFwiLCB1c2Vyc0FycmF5KTtcbiAgICAgICAgICAvLyBBbmQgcmVtZW1iZXIgdG8gcmV0dXJuIHRoZSB2YWx1ZSB0byB0aGUgR2V0dGVyU2V0dGVyXG4gICAgICAgICAgcmV0dXJuIHVzZXJzQXJyYXk7XG4gICAgICB9KTtcbiAgICAgICovXG4vKi8vLy8vLy8vLy8vLy8vLy8vLy8vU3R1ZmYgQWJvdmUgQXJlIEV4cGVyaW1lbnRhbC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8qL1xuXG5mdW5jdGlvbiBjb250cm9sbGVyMzYwKGRlZywgYWx0ZXJEZWcpe1xuXG4gIGlmKGFsdGVyRGVnID4gMCl7XG4gICAgaWYoZGVnID49IDM2MClcbiAgICAgIHJldHVybiAwXG4gIH1cblxuICBpZihhbHRlckRlZyA8IDApe1xuICAgIC8vY29uc29sZS5sb2coJ2RlZy1hbHRlckRlZycsIGRlZywgYWx0ZXJEZWcsIGRlZy1hbHRlckRlZylcbiAgICBpZihkZWcgPD0gMClcbiAgICAgIHJldHVybiAzNjBcbiAgfVxuICBcbiAgcmV0dXJuIGRlZyoxK2FsdGVyRGVnICAgIFxuXG59XG5cbnZhciBmaXJzdEZyYW1lID0gMCxcbmZpcnN0RnJhbWUyID0gMCA7XG5mdW5jdGlvbiBnZXRWZWN0b3JYeSh4Q29vcmQsIHlDb29yZCwgYW5nbGUsIGxlbmd0aCkge1xuICAgIC8vY29uc29sZS5sb2coJ2dldHZlY3Rvcnh5JywgeENvb3JkLCB5Q29vcmQsIGFuZ2xlLCBsZW5ndGgpOyBcbiAgICBsZW5ndGggPSB0eXBlb2YgbGVuZ3RoICE9PSAndW5kZWZpbmVkJyA/IGxlbmd0aCA6IDEwO1xuICAgIGFuZ2xlID0gYW5nbGUgKiBNYXRoLlBJIC8gMTgwOyAvLyBpZiB5b3UncmUgdXNpbmcgZGVncmVlcyBpbnN0ZWFkIG9mIHJhZGlhbnNcbiAgICB2YXIgeHkgPSAgW2xlbmd0aCAqIE1hdGguY29zKGFuZ2xlKSArIHhDb29yZCwgbGVuZ3RoICogTWF0aC5zaW4oYW5nbGUpICsgeUNvb3JkXVxuXG4gICAgdmFyIHcgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICB2YXIgaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjb25zb2xlLmxvZygnd2gnLCB3LCBoKVxuICAgIFxuICAgIC8vIGlmIHRoZSBzcGFjZXNoaXAgZ29lcyBvZmYgc2NyZWVuIGhvcml6b250YWxcbiAgICBpZih4eVswXSA+PSB3KXtcbiAgICAgIGNvbnNvbGUubG9nKCdzaGZpdCBob3Jpem9udGFsJylcbiAgICBcbiAgICAgIGZpcnN0RnJhbWUgPSB3XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oeHlbMF0gLSAody8yKSwgZmlyc3RGcmFtZTIpO1xuICAgIH1cbiAgICBpZigoZmlyc3RGcmFtZSA+IDApICYmICh4eVswXSA8PSB3KSl7XG4gICAgICBjb25zb2xlLmxvZygnc2hmaXQgYmFjayBob3Jpem9udGFsJylcbiAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBmaXJzdEZyYW1lMik7XG4gICAgfSBcblxuICAgIC8vIGlmIHRoZSBzcGFjZXNoaXAgZ29lcyBvZmYgc2NyZWVuIHZlcnRpY2FsXG4gICAgaWYoeHlbMV0gPj0gaCl7XG4gICAgICBmaXJzdEZyYW1lMiA9IGhcbiAgICAgIGNvbnNvbGUubG9nKCdzaGZpdCB2ZXJ0aWNhbCAnKVxuICAgICAgXG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oZmlyc3RGcmFtZSwgeHlbMV0gLSAoaC8yKSk7XG4gICAgfVxuICAgIGlmKChmaXJzdEZyYW1lMiA+IDApICYmICh4eVsxXSA8PSBoKSl7XG4gICAgICBjb25zb2xlLmxvZygnc2hmaXQgYmFjayB2ZXJ0aWNhbCAnKVxuICAgICAgd2luZG93LnNjcm9sbFRvKGZpcnN0RnJhbWUsIDApO1xuICAgIH0gXG5cbiAgICAvL2NvbnNvbGUubG9nKCd3aW5kb3cgaW5uZXIgJywgdywgaCwgeHlbMF0sIGZpcnN0RnJhbWUpXG4gICAgcmV0dXJuIHh5XG59XG5cblxuXG5mdW5jdGlvbiBjc3NSb3RhdGUoZGVnLCB4eSl7XG5cbiAgZGVnID0gZGVnICsgOTBcbiAgcmV0dXJuICcgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSgnK2RlZysnZGVnKTsnXG4gICAgKyctbW96LXRyYW5zZm9ybTogcm90YXRlKCcrZGVnKydkZWcpOydcbiAgICArJy1vLXRyYW5zZm9ybTogcm90YXRlKCcrZGVnKydkZWcpOydcbiAgICArJy1tcy10cmFuc2Zvcm06IHJvdGF0ZSgnK2RlZysnZGVnKTsnXG4gICAgKyd0cmFuc2Zvcm06IHJvdGF0ZSgnK2RlZysnZGVnKTsnXG4gICAgKydwb3NpdGlvbjogYWJzb2x1dGU7J1xuICAgICsnbGVmdDogJyArIHh5WzBdICsgJ3B4OydcbiAgICArJ3RvcDogJyArIHh5WzFdICsgJ3B4OydcbiAgICArJ3otaW5kZXg6IDEwMDsnXG4gICsgJ2FuaW1hdGlvbi1kdXJhdGlvbjogMC41czsnXG4gICsgJ2FuaW1hdGlvbi1uYW1lOiBwbGF5ZXItZmxhc2g7J1xuICArICdhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTsnXG4gICsgJ2FuaW1hdGlvbi1kaXJlY3Rpb246IGFsdGVybmF0ZS1yZXZlcnNlOydcbiAgICBcblxuXG59XG5cbnZhciBzcGFjZSA9IHtcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcblxuXG5cbiAgICAgIHJldHVybiB7XG4gICAgICBwbGF5ZXJQb3NpdGlvbiA6IG0ucHJvcChbMCwwXSksIFxuICAgICAgcGxheWVyUG9zaXRpb25YIDogbS5wcm9wKDApLCBcbiAgICAgIHBsYXllclBvc2l0aW9uWSA6IG0ucHJvcCgwKSwgXG4gICAgICBwbGF5ZXJSb3RhdGlvbiA6IG0ucHJvcCgwKSwgXG4gICAgICBwbGF5ZXJTdHlsZSAgOiBtLnByb3AoY3NzUm90YXRlKDAsWzAsMF0pKSxcbiAgICAgIHNwcml0ZTpcbiAgICAgICAge1xuICAgICAgICAgIHNwYWNlOlxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnaW1nL3NwYWNlLzAxLnBuZycsXG4gICAgICAgICAgICAgICdpbWcvc3BhY2UvMDIucG5nJ1xuXG4gICAgICAgICAgICBdXG4gICAgICAgICAgLFxuICAgICAgICAgIHBsYXllcjpcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ2ltZy9wbGF5ZXIvMDEucG5nJyxcbiAgICAgICAgICAgICAgJ2ltZy9wbGF5ZXIvMDIucG5nJyxcbiAgICAgICAgICAgICAgJ2ltZy9wbGF5ZXIvMDMucG5nJyxcbiAgICAgICAgICAgICAgJ2ltZy9wbGF5ZXIvMDQucG5nJyxcbiAgICAgICAgICAgICAgJ2ltZy9wbGF5ZXIvMDUucG5nJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgcGxhbmV0OlxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnaW1nL3BsYW5ldC9mdXp6eS5wbmcnLFxuICAgICAgICAgICAgICAnaW1nL3BsYW5ldC9oYWxmc3FhZ2VsLnBuZycsXG4gICAgICAgICAgICAgICdpbWcvcGxhbmV0L3NtYWVrbHVuZy5wbmcnLFxuICAgICAgICAgICAgICAnaW1nL3BsYW5ldC94eC5wbmcnLFxuICAgICAgICAgICAgICAnaW1nL3BsYW5ldC9zZW1pc3F5YXJlLXBsYW5ldC5wbmcnXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIGxpbmtzIDogW1xuICAgICAgICAgIFwiaHR0cDovL2Ftb2sud3RmL3NwYWNlYnJpZGdlL1wiXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIFxuICAgIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICAgIC8vY29uc29sZS5sb2coJ3NwYWNlQm9va1VzZXJzJywgc3BhY2VCb29rVXNlcnMoKSlcbiAgICAgIHZhciBkZWcsIFxuICAgICAgdGhlU2hpcCA9ICBtKCdpbWcjcGxheWVyJywgeyBzdHlsZSA6IGN0cmwucGxheWVyU3R5bGUoKSwgIHNyYzogY3RybC5zcHJpdGUucGxheWVyWzBdfSk7XG5cbiAgICAgIGRvY3VtZW50Lm9ua2V5dXAgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBtdXRlU291bmQoKVxuICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50LmtleUNvZGUpXG5jb25zb2xlLmxvZyhjdHJsLnBsYXllclJvdGF0aW9uKCkgKVxuXG4gICAgICAgIHN3aXRjaChldmVudC5rZXlDb2RlKXtcbiAgICAgICAgICBjYXNlIDM3OiAvLzwtXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpICAgICAgICAgIFxuICAgICAgICAgICAgZGVnID0gY29udHJvbGxlcjM2MChjdHJsLnBsYXllclJvdGF0aW9uKCksIC0xKVxuICAgICAgICAgICAgY3RybC5wbGF5ZXJSb3RhdGlvbihkZWcpXG4gICAgICAgICAgICBjdHJsLnBsYXllclN0eWxlKCBjc3NSb3RhdGUoIGRlZywgY3RybC5wbGF5ZXJQb3NpdGlvbigpICApIClcblxuICAgICAgICAgICAgbS5yZWRyYXcoKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICBcbiAgICAgICAgICBjYXNlIDM5OiAvLy0+XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICBkZWcgPSBjb250cm9sbGVyMzYwKGN0cmwucGxheWVyUm90YXRpb24oKSwgKzEpXG4gICAgICAgICAgICBjdHJsLnBsYXllclJvdGF0aW9uKGRlZylcbiAgICAgICAgICAgIGN0cmwucGxheWVyU3R5bGUoIGNzc1JvdGF0ZSggZGVnLCBjdHJsLnBsYXllclBvc2l0aW9uKCkgICkgKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBtLnJlZHJhdygpXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3cga2V5XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgY2FzZSAzODogLy8gXiB1cCBhcnJvdyBrZXlcbiAgICAgICAgICAgIHhDb29yZCA9IHdpbmRvdy5zY3JvbGxYXG4gICAgICAgICAgICB5Q29vcmQgPSB3aW5kb3cuc2Nyb2xsWVxuICAgICAgICAgICAgcmVzb2x1dGlvbiA9IEZPUldBUkRfU1BFRURcbiAgICAgICAgICAgIHZhciB4eSA9IGdldFZlY3Rvclh5KGN0cmwucGxheWVyUG9zaXRpb25YKCksIGN0cmwucGxheWVyUG9zaXRpb25ZKCksIGN0cmwucGxheWVyUm90YXRpb24oKSwgcmVzb2x1dGlvbilcblxuICAgICAgICAgICAgLy8gc2F2ZSBuZXcgcG9zaXRpb25cbiAgICAgICAgICAgIGN0cmwucGxheWVyUG9zaXRpb25YKHh5WzBdKVxuICAgICAgICAgICAgY3RybC5wbGF5ZXJQb3NpdGlvblkoeHlbMV0pXG4gICAgICAgICAgICBjdHJsLnBsYXllclBvc2l0aW9uKHh5KVxuXG4gICAgICAgICAgICAvLyBzZXQgdGhlIHN0eWxlIHNoZWV0XG4gICAgICAgICAgICBjdHJsLnBsYXllclN0eWxlKCBjc3NSb3RhdGUoIGN0cmwucGxheWVyUm90YXRpb24oKSwgW2N0cmwucGxheWVyUG9zaXRpb25YKCksIGN0cmwucGxheWVyUG9zaXRpb25ZKCldICApIClcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2N1cnJlbnQgcG9zaXRpb246ICcsIGN0cmwucGxheWVyUG9zaXRpb24oKSwgeHkpICAgICAgICAgICAgXG4gICAgICAgICAgICBtLnJlZHJhdygpXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4vLyAgICBjb25zb2xlLmxvZygnc3ByaXQnLCBjdHJsLnNwcml0ZS5wbGFuZXRbMF0sIGN0cmwuc3ByaXRlLnBsYXllcltEYXRlLm5vdygpJWN0cmwuc3ByaXRlLnBsYXllci5sZW5ndGgtMV0pXG4gICAgICAgIHJldHVybiBtKCcuYXBwJywgW1xuICAgICAgICAgICAgbSgnLnJvdGF0ZScsIFsgXG4vLyAgICAgICAgICAgICAgbSgnaW1nLnNwYWNlJywge3NyYzogY3RybC5zcHJpdGUuc3BhY2VbMV19KSxcbiAgICAgICAgICAgICAgbSgnaW1nLnNwYWNlJywge3NyYzogY3RybC5zcHJpdGUuc3BhY2VbMF19KSxcbiAgICAgICAgICAgICAgdGhlU2hpcCxcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBtKCdpbWcuc3BhY2Vib29rLXVzZXJzJywge3NyYzogY3RybC5zcHJpdGUucGxhbmV0WzFdfSksXG4gICAgICAgICAgICAgIG0oJ2ltZy5zcGFjZWJvb2stdXNlcnMnLCB7c3JjOiBjdHJsLnNwcml0ZS5wbGFuZXRbMl19KSxcbiAgICAgICAgICAgICAgbSgnaW1nLnNwYWNlYm9vay11c2VycycsIHtzcmM6IGN0cmwuc3ByaXRlLnBsYW5ldFszXX0pXG4gICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgc3BhY2VCb29rVXNlcnMubWFwKGZ1bmN0aW9uKHNVc2VyKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbSgnLmFydGlzdC1uYW1lcycsIHNVc2VyLm5hbWUsWyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbSgnaW1nLnNwYWNlYm9vay11c2VycycsIHtzcmM6IHNVc2VyLmltYWdlfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgbSgnLnBsYW5ldCcsIFtcbiAgICAgICAgICAgICAgbSgnaW1nJywge3NyYzogY3RybC5zcHJpdGUucGxhbmV0WzBdfSksXG4gICAgICAgICAgICAgIG0oJ2ltZy5wbGF5ZXInLCB7c3JjOiBjdHJsLnNwcml0ZS5wbGF5ZXJbRGF0ZS5ub3coKSVjdHJsLnNwcml0ZS5wbGF5ZXIubGVuZ3RoLTFdfSlcbi8vICAgICAgICAgICAgICBtKCdpZnJhbWUuYW1vaycsIHtzcmM6IGN0cmwubGlua3NbMF19KVxuICAgICAgICAgICAgXSksXG5cbiAgICAgICAgICAgIG0oJyNwMS5wbGFuZXQnLCBbXG4gICAgICAgICAgICAgIG0oJ2ltZycsIHtzcmM6IGN0cmwuc3ByaXRlLnBsYW5ldFsxXX0pLFxuICAgICAgICAgICAgXSksXG5cbiAgICAgICAgICAgIG0oJyNwMi5wbGFuZXQnLCBbXG4gICAgICAgICAgICAgIG0oJ2ltZycsIHtzcmM6IGN0cmwuc3ByaXRlLnBsYW5ldFsyXX0pLFxuICAgICAgICAgICAgXSksXG5cbiAgICAgICAgICAgIG0oJyNwMy5wbGFuZXQnLCBbXG4gICAgICAgICAgICAgIG0oJ2ltZycsIHtzcmM6IGN0cmwuc3ByaXRlLnBsYW5ldFszXX0pLFxuICAgICAgICAgICAgXSksXG5cblxuICAgICAgICAgICAgbSgnI3A0LnBsYW5ldCcsIFtcbiAgICAgICAgICAgICAgbSgnaW1nJywge3NyYzogY3RybC5zcHJpdGUucGxhbmV0WzRdfSksXG4gICAgICAgICAgICBdKSxcblxuXG4gICAgICAgICAgICBtKCdoMS50aXRsZScsIFwiJC4vcnVtM1wiKVxuICAgICAgICAgIF1cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKXtcbiAgICBtLm1vdW50KGRvY3VtZW50LmJvZHksIHNwYWNlKVxufVxuXG5cblxuIiwiOyhmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuXHRcInVzZSBzdHJpY3RcIlxyXG5cdC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXHJcblx0dmFyIG0gPSBmYWN0b3J5KGdsb2JhbClcclxuXHRpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUgIT0gbnVsbCAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBtXHJcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xyXG5cdFx0ZGVmaW5lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG0gfSlcclxuXHR9IGVsc2Uge1xyXG5cdFx0Z2xvYmFsLm0gPSBtXHJcblx0fVxyXG5cdC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cclxufSkodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHRoaXMsIGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcblx0XCJ1c2Ugc3RyaWN0XCJcclxuXHJcblx0bS52ZXJzaW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIFwidjAuMi4zXCJcclxuXHR9XHJcblxyXG5cdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eVxyXG5cdHZhciB0eXBlID0ge30udG9TdHJpbmdcclxuXHJcblx0ZnVuY3Rpb24gaXNGdW5jdGlvbihvYmplY3QpIHtcclxuXHRcdHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSBcImZ1bmN0aW9uXCJcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGlzT2JqZWN0KG9iamVjdCkge1xyXG5cdFx0cmV0dXJuIHR5cGUuY2FsbChvYmplY3QpID09PSBcIltvYmplY3QgT2JqZWN0XVwiXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBpc1N0cmluZyhvYmplY3QpIHtcclxuXHRcdHJldHVybiB0eXBlLmNhbGwob2JqZWN0KSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIlxyXG5cdH1cclxuXHJcblx0dmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuXHRcdHJldHVybiB0eXBlLmNhbGwob2JqZWN0KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBub29wKCkge31cclxuXHJcblx0dmFyIHZvaWRFbGVtZW50cyA9IHtcclxuXHRcdEFSRUE6IDEsXHJcblx0XHRCQVNFOiAxLFxyXG5cdFx0QlI6IDEsXHJcblx0XHRDT0w6IDEsXHJcblx0XHRDT01NQU5EOiAxLFxyXG5cdFx0RU1CRUQ6IDEsXHJcblx0XHRIUjogMSxcclxuXHRcdElNRzogMSxcclxuXHRcdElOUFVUOiAxLFxyXG5cdFx0S0VZR0VOOiAxLFxyXG5cdFx0TElOSzogMSxcclxuXHRcdE1FVEE6IDEsXHJcblx0XHRQQVJBTTogMSxcclxuXHRcdFNPVVJDRTogMSxcclxuXHRcdFRSQUNLOiAxLFxyXG5cdFx0V0JSOiAxXHJcblx0fVxyXG5cclxuXHQvLyBjYWNoaW5nIGNvbW1vbmx5IHVzZWQgdmFyaWFibGVzXHJcblx0dmFyICRkb2N1bWVudCwgJGxvY2F0aW9uLCAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCAkY2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuXHJcblx0Ly8gc2VsZiBpbnZva2luZyBmdW5jdGlvbiBuZWVkZWQgYmVjYXVzZSBvZiB0aGUgd2F5IG1vY2tzIHdvcmtcclxuXHRmdW5jdGlvbiBpbml0aWFsaXplKG1vY2spIHtcclxuXHRcdCRkb2N1bWVudCA9IG1vY2suZG9jdW1lbnRcclxuXHRcdCRsb2NhdGlvbiA9IG1vY2subG9jYXRpb25cclxuXHRcdCRjYW5jZWxBbmltYXRpb25GcmFtZSA9IG1vY2suY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHwgbW9jay5jbGVhclRpbWVvdXRcclxuXHRcdCRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBtb2NrLnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBtb2NrLnNldFRpbWVvdXRcclxuXHR9XHJcblxyXG5cdC8vIHRlc3RpbmcgQVBJXHJcblx0bS5kZXBzID0gZnVuY3Rpb24gKG1vY2spIHtcclxuXHRcdGluaXRpYWxpemUoZ2xvYmFsID0gbW9jayB8fCB3aW5kb3cpXHJcblx0XHRyZXR1cm4gZ2xvYmFsXHJcblx0fVxyXG5cclxuXHRtLmRlcHMoZ2xvYmFsKVxyXG5cclxuXHQvKipcclxuXHQgKiBAdHlwZWRlZiB7U3RyaW5nfSBUYWdcclxuXHQgKiBBIHN0cmluZyB0aGF0IGxvb2tzIGxpa2UgLT4gZGl2LmNsYXNzbmFtZSNpZFtwYXJhbT1vbmVdW3BhcmFtMj10d29dXHJcblx0ICogV2hpY2ggZGVzY3JpYmVzIGEgRE9NIG5vZGVcclxuXHQgKi9cclxuXHJcblx0ZnVuY3Rpb24gcGFyc2VUYWdBdHRycyhjZWxsLCB0YWcpIHtcclxuXHRcdHZhciBjbGFzc2VzID0gW11cclxuXHRcdHZhciBwYXJzZXIgPSAvKD86KF58I3xcXC4pKFteI1xcLlxcW1xcXV0rKSl8KFxcWy4rP1xcXSkvZ1xyXG5cdFx0dmFyIG1hdGNoXHJcblxyXG5cdFx0d2hpbGUgKChtYXRjaCA9IHBhcnNlci5leGVjKHRhZykpKSB7XHJcblx0XHRcdGlmIChtYXRjaFsxXSA9PT0gXCJcIiAmJiBtYXRjaFsyXSkge1xyXG5cdFx0XHRcdGNlbGwudGFnID0gbWF0Y2hbMl1cclxuXHRcdFx0fSBlbHNlIGlmIChtYXRjaFsxXSA9PT0gXCIjXCIpIHtcclxuXHRcdFx0XHRjZWxsLmF0dHJzLmlkID0gbWF0Y2hbMl1cclxuXHRcdFx0fSBlbHNlIGlmIChtYXRjaFsxXSA9PT0gXCIuXCIpIHtcclxuXHRcdFx0XHRjbGFzc2VzLnB1c2gobWF0Y2hbMl0pXHJcblx0XHRcdH0gZWxzZSBpZiAobWF0Y2hbM11bMF0gPT09IFwiW1wiKSB7XHJcblx0XHRcdFx0dmFyIHBhaXIgPSAvXFxbKC4rPykoPzo9KFwifCd8KSguKj8pXFwyKT9cXF0vLmV4ZWMobWF0Y2hbM10pXHJcblx0XHRcdFx0Y2VsbC5hdHRyc1twYWlyWzFdXSA9IHBhaXJbM10gfHwgXCJcIlxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGNsYXNzZXNcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFZpcnR1YWxDaGlsZHJlbihhcmdzLCBoYXNBdHRycykge1xyXG5cdFx0dmFyIGNoaWxkcmVuID0gaGFzQXR0cnMgPyBhcmdzLnNsaWNlKDEpIDogYXJnc1xyXG5cclxuXHRcdGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEgJiYgaXNBcnJheShjaGlsZHJlblswXSkpIHtcclxuXHRcdFx0cmV0dXJuIGNoaWxkcmVuWzBdXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gY2hpbGRyZW5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFzc2lnbkF0dHJzKHRhcmdldCwgYXR0cnMsIGNsYXNzZXMpIHtcclxuXHRcdHZhciBjbGFzc0F0dHIgPSBcImNsYXNzXCIgaW4gYXR0cnMgPyBcImNsYXNzXCIgOiBcImNsYXNzTmFtZVwiXHJcblxyXG5cdFx0Zm9yICh2YXIgYXR0ck5hbWUgaW4gYXR0cnMpIHtcclxuXHRcdFx0aWYgKGhhc093bi5jYWxsKGF0dHJzLCBhdHRyTmFtZSkpIHtcclxuXHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IGNsYXNzQXR0ciAmJlxyXG5cdFx0XHRcdFx0XHRhdHRyc1thdHRyTmFtZV0gIT0gbnVsbCAmJlxyXG5cdFx0XHRcdFx0XHRhdHRyc1thdHRyTmFtZV0gIT09IFwiXCIpIHtcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaChhdHRyc1thdHRyTmFtZV0pXHJcblx0XHRcdFx0XHQvLyBjcmVhdGUga2V5IGluIGNvcnJlY3QgaXRlcmF0aW9uIG9yZGVyXHJcblx0XHRcdFx0XHR0YXJnZXRbYXR0ck5hbWVdID0gXCJcIlxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0YXJnZXRbYXR0ck5hbWVdID0gYXR0cnNbYXR0ck5hbWVdXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNsYXNzZXMubGVuZ3RoKSB0YXJnZXRbY2xhc3NBdHRyXSA9IGNsYXNzZXMuam9pbihcIiBcIilcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtUYWd9IFRoZSBET00gbm9kZSB0YWdcclxuXHQgKiBAcGFyYW0ge09iamVjdD1bXX0gb3B0aW9uYWwga2V5LXZhbHVlIHBhaXJzIHRvIGJlIG1hcHBlZCB0byBET00gYXR0cnNcclxuXHQgKiBAcGFyYW0gey4uLm1Ob2RlPVtdfSBaZXJvIG9yIG1vcmUgTWl0aHJpbCBjaGlsZCBub2Rlcy4gQ2FuIGJlIGFuIGFycmF5LFxyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgIG9yIHNwbGF0IChvcHRpb25hbClcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBtKHRhZywgcGFpcnMpIHtcclxuXHRcdHZhciBhcmdzID0gW11cclxuXHJcblx0XHRmb3IgKHZhciBpID0gMSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzT2JqZWN0KHRhZykpIHJldHVybiBwYXJhbWV0ZXJpemUodGFnLCBhcmdzKVxyXG5cclxuXHRcdGlmICghaXNTdHJpbmcodGFnKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJzZWxlY3RvciBpbiBtKHNlbGVjdG9yLCBhdHRycywgY2hpbGRyZW4pIHNob3VsZCBcIiArXHJcblx0XHRcdFx0XCJiZSBhIHN0cmluZ1wiKVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBoYXNBdHRycyA9IHBhaXJzICE9IG51bGwgJiYgaXNPYmplY3QocGFpcnMpICYmXHJcblx0XHRcdCEoXCJ0YWdcIiBpbiBwYWlycyB8fCBcInZpZXdcIiBpbiBwYWlycyB8fCBcInN1YnRyZWVcIiBpbiBwYWlycylcclxuXHJcblx0XHR2YXIgYXR0cnMgPSBoYXNBdHRycyA/IHBhaXJzIDoge31cclxuXHRcdHZhciBjZWxsID0ge1xyXG5cdFx0XHR0YWc6IFwiZGl2XCIsXHJcblx0XHRcdGF0dHJzOiB7fSxcclxuXHRcdFx0Y2hpbGRyZW46IGdldFZpcnR1YWxDaGlsZHJlbihhcmdzLCBoYXNBdHRycylcclxuXHRcdH1cclxuXHJcblx0XHRhc3NpZ25BdHRycyhjZWxsLmF0dHJzLCBhdHRycywgcGFyc2VUYWdBdHRycyhjZWxsLCB0YWcpKVxyXG5cdFx0cmV0dXJuIGNlbGxcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZvckVhY2gobGlzdCwgZikge1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aCAmJiAhZihsaXN0W2ldLCBpKyspOykge1xyXG5cdFx0XHQvLyBmdW5jdGlvbiBjYWxsZWQgaW4gY29uZGl0aW9uXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBmb3JLZXlzKGxpc3QsIGYpIHtcclxuXHRcdGZvckVhY2gobGlzdCwgZnVuY3Rpb24gKGF0dHJzLCBpKSB7XHJcblx0XHRcdHJldHVybiAoYXR0cnMgPSBhdHRycyAmJiBhdHRycy5hdHRycykgJiZcclxuXHRcdFx0XHRhdHRycy5rZXkgIT0gbnVsbCAmJlxyXG5cdFx0XHRcdGYoYXR0cnMsIGkpXHJcblx0XHR9KVxyXG5cdH1cclxuXHQvLyBUaGlzIGZ1bmN0aW9uIHdhcyBjYXVzaW5nIGRlb3B0cyBpbiBDaHJvbWUuXHJcblx0ZnVuY3Rpb24gZGF0YVRvU3RyaW5nKGRhdGEpIHtcclxuXHRcdC8vIGRhdGEudG9TdHJpbmcoKSBtaWdodCB0aHJvdyBvciByZXR1cm4gbnVsbCBpZiBkYXRhIGlzIHRoZSByZXR1cm5cclxuXHRcdC8vIHZhbHVlIG9mIENvbnNvbGUubG9nIGluIHNvbWUgdmVyc2lvbnMgb2YgRmlyZWZveCAoYmVoYXZpb3IgZGVwZW5kcyBvblxyXG5cdFx0Ly8gdmVyc2lvbilcclxuXHRcdHRyeSB7XHJcblx0XHRcdGlmIChkYXRhICE9IG51bGwgJiYgZGF0YS50b1N0cmluZygpICE9IG51bGwpIHJldHVybiBkYXRhXHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vIHNpbGVudGx5IGlnbm9yZSBlcnJvcnNcclxuXHRcdH1cclxuXHRcdHJldHVybiBcIlwiXHJcblx0fVxyXG5cclxuXHQvLyBUaGlzIGZ1bmN0aW9uIHdhcyBjYXVzaW5nIGRlb3B0cyBpbiBDaHJvbWUuXHJcblx0ZnVuY3Rpb24gaW5qZWN0VGV4dE5vZGUocGFyZW50RWxlbWVudCwgZmlyc3QsIGluZGV4LCBkYXRhKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRpbnNlcnROb2RlKHBhcmVudEVsZW1lbnQsIGZpcnN0LCBpbmRleClcclxuXHRcdFx0Zmlyc3Qubm9kZVZhbHVlID0gZGF0YVxyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHQvLyBJRSBlcnJvbmVvdXNseSB0aHJvd3MgZXJyb3Igd2hlbiBhcHBlbmRpbmcgYW4gZW1wdHkgdGV4dCBub2RlXHJcblx0XHRcdC8vIGFmdGVyIGEgbnVsbFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZmxhdHRlbihsaXN0KSB7XHJcblx0XHQvLyByZWN1cnNpdmVseSBmbGF0dGVuIGFycmF5XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKGlzQXJyYXkobGlzdFtpXSkpIHtcclxuXHRcdFx0XHRsaXN0ID0gbGlzdC5jb25jYXQuYXBwbHkoW10sIGxpc3QpXHJcblx0XHRcdFx0Ly8gY2hlY2sgY3VycmVudCBpbmRleCBhZ2FpbiBhbmQgZmxhdHRlbiB1bnRpbCB0aGVyZSBhcmUgbm8gbW9yZVxyXG5cdFx0XHRcdC8vIG5lc3RlZCBhcnJheXMgYXQgdGhhdCBpbmRleFxyXG5cdFx0XHRcdGktLVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbGlzdFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaW5zZXJ0Tm9kZShwYXJlbnRFbGVtZW50LCBub2RlLCBpbmRleCkge1xyXG5cdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZSxcclxuXHRcdFx0cGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSB8fCBudWxsKVxyXG5cdH1cclxuXHJcblx0dmFyIERFTEVUSU9OID0gMVxyXG5cdHZhciBJTlNFUlRJT04gPSAyXHJcblx0dmFyIE1PVkUgPSAzXHJcblxyXG5cdGZ1bmN0aW9uIGhhbmRsZUtleXNEaWZmZXIoZGF0YSwgZXhpc3RpbmcsIGNhY2hlZCwgcGFyZW50RWxlbWVudCkge1xyXG5cdFx0Zm9yS2V5cyhkYXRhLCBmdW5jdGlvbiAoa2V5LCBpKSB7XHJcblx0XHRcdGV4aXN0aW5nW2tleSA9IGtleS5rZXldID0gZXhpc3Rpbmdba2V5XSA/IHtcclxuXHRcdFx0XHRhY3Rpb246IE1PVkUsXHJcblx0XHRcdFx0aW5kZXg6IGksXHJcblx0XHRcdFx0ZnJvbTogZXhpc3Rpbmdba2V5XS5pbmRleCxcclxuXHRcdFx0XHRlbGVtZW50OiBjYWNoZWQubm9kZXNbZXhpc3Rpbmdba2V5XS5pbmRleF0gfHxcclxuXHRcdFx0XHRcdCRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcblx0XHRcdH0gOiB7YWN0aW9uOiBJTlNFUlRJT04sIGluZGV4OiBpfVxyXG5cdFx0fSlcclxuXHJcblx0XHR2YXIgYWN0aW9ucyA9IFtdXHJcblx0XHRmb3IgKHZhciBwcm9wIGluIGV4aXN0aW5nKSB7XHJcblx0XHRcdGlmIChoYXNPd24uY2FsbChleGlzdGluZywgcHJvcCkpIHtcclxuXHRcdFx0XHRhY3Rpb25zLnB1c2goZXhpc3RpbmdbcHJvcF0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2hhbmdlcyA9IGFjdGlvbnMuc29ydChzb3J0Q2hhbmdlcylcclxuXHRcdHZhciBuZXdDYWNoZWQgPSBuZXcgQXJyYXkoY2FjaGVkLmxlbmd0aClcclxuXHJcblx0XHRuZXdDYWNoZWQubm9kZXMgPSBjYWNoZWQubm9kZXMuc2xpY2UoKVxyXG5cclxuXHRcdGZvckVhY2goY2hhbmdlcywgZnVuY3Rpb24gKGNoYW5nZSkge1xyXG5cdFx0XHR2YXIgaW5kZXggPSBjaGFuZ2UuaW5kZXhcclxuXHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IERFTEVUSU9OKSB7XHJcblx0XHRcdFx0Y2xlYXIoY2FjaGVkW2luZGV4XS5ub2RlcywgY2FjaGVkW2luZGV4XSlcclxuXHRcdFx0XHRuZXdDYWNoZWQuc3BsaWNlKGluZGV4LCAxKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjaGFuZ2UuYWN0aW9uID09PSBJTlNFUlRJT04pIHtcclxuXHRcdFx0XHR2YXIgZHVtbXkgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG5cdFx0XHRcdGR1bW15LmtleSA9IGRhdGFbaW5kZXhdLmF0dHJzLmtleVxyXG5cdFx0XHRcdGluc2VydE5vZGUocGFyZW50RWxlbWVudCwgZHVtbXksIGluZGV4KVxyXG5cdFx0XHRcdG5ld0NhY2hlZC5zcGxpY2UoaW5kZXgsIDAsIHtcclxuXHRcdFx0XHRcdGF0dHJzOiB7a2V5OiBkYXRhW2luZGV4XS5hdHRycy5rZXl9LFxyXG5cdFx0XHRcdFx0bm9kZXM6IFtkdW1teV1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdG5ld0NhY2hlZC5ub2Rlc1tpbmRleF0gPSBkdW1teVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoY2hhbmdlLmFjdGlvbiA9PT0gTU9WRSkge1xyXG5cdFx0XHRcdHZhciBjaGFuZ2VFbGVtZW50ID0gY2hhbmdlLmVsZW1lbnRcclxuXHRcdFx0XHR2YXIgbWF5YmVDaGFuZ2VkID0gcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XVxyXG5cdFx0XHRcdGlmIChtYXliZUNoYW5nZWQgIT09IGNoYW5nZUVsZW1lbnQgJiYgY2hhbmdlRWxlbWVudCAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoY2hhbmdlRWxlbWVudCxcclxuXHRcdFx0XHRcdFx0bWF5YmVDaGFuZ2VkIHx8IG51bGwpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld0NhY2hlZFtpbmRleF0gPSBjYWNoZWRbY2hhbmdlLmZyb21dXHJcblx0XHRcdFx0bmV3Q2FjaGVkLm5vZGVzW2luZGV4XSA9IGNoYW5nZUVsZW1lbnRcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0XHRyZXR1cm4gbmV3Q2FjaGVkXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBkaWZmS2V5cyhkYXRhLCBjYWNoZWQsIGV4aXN0aW5nLCBwYXJlbnRFbGVtZW50KSB7XHJcblx0XHR2YXIga2V5c0RpZmZlciA9IGRhdGEubGVuZ3RoICE9PSBjYWNoZWQubGVuZ3RoXHJcblxyXG5cdFx0aWYgKCFrZXlzRGlmZmVyKSB7XHJcblx0XHRcdGZvcktleXMoZGF0YSwgZnVuY3Rpb24gKGF0dHJzLCBpKSB7XHJcblx0XHRcdFx0dmFyIGNhY2hlZENlbGwgPSBjYWNoZWRbaV1cclxuXHRcdFx0XHRyZXR1cm4ga2V5c0RpZmZlciA9IGNhY2hlZENlbGwgJiZcclxuXHRcdFx0XHRcdGNhY2hlZENlbGwuYXR0cnMgJiZcclxuXHRcdFx0XHRcdGNhY2hlZENlbGwuYXR0cnMua2V5ICE9PSBhdHRycy5rZXlcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoa2V5c0RpZmZlcikge1xyXG5cdFx0XHRyZXR1cm4gaGFuZGxlS2V5c0RpZmZlcihkYXRhLCBleGlzdGluZywgY2FjaGVkLCBwYXJlbnRFbGVtZW50KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGNhY2hlZFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZGlmZkFycmF5KGRhdGEsIGNhY2hlZCwgbm9kZXMpIHtcclxuXHRcdC8vIGRpZmYgdGhlIGFycmF5IGl0c2VsZlxyXG5cclxuXHRcdC8vIHVwZGF0ZSB0aGUgbGlzdCBvZiBET00gbm9kZXMgYnkgY29sbGVjdGluZyB0aGUgbm9kZXMgZnJvbSBlYWNoIGl0ZW1cclxuXHRcdGZvckVhY2goZGF0YSwgZnVuY3Rpb24gKF8sIGkpIHtcclxuXHRcdFx0aWYgKGNhY2hlZFtpXSAhPSBudWxsKSBub2Rlcy5wdXNoLmFwcGx5KG5vZGVzLCBjYWNoZWRbaV0ubm9kZXMpXHJcblx0XHR9KVxyXG5cdFx0Ly8gcmVtb3ZlIGl0ZW1zIGZyb20gdGhlIGVuZCBvZiB0aGUgYXJyYXkgaWYgdGhlIG5ldyBhcnJheSBpcyBzaG9ydGVyXHJcblx0XHQvLyB0aGFuIHRoZSBvbGQgb25lLiBpZiBlcnJvcnMgZXZlciBoYXBwZW4gaGVyZSwgdGhlIGlzc3VlIGlzIG1vc3RcclxuXHRcdC8vIGxpa2VseSBhIGJ1ZyBpbiB0aGUgY29uc3RydWN0aW9uIG9mIHRoZSBgY2FjaGVkYCBkYXRhIHN0cnVjdHVyZVxyXG5cdFx0Ly8gc29tZXdoZXJlIGVhcmxpZXIgaW4gdGhlIHByb2dyYW1cclxuXHRcdGZvckVhY2goY2FjaGVkLm5vZGVzLCBmdW5jdGlvbiAobm9kZSwgaSkge1xyXG5cdFx0XHRpZiAobm9kZS5wYXJlbnROb2RlICE9IG51bGwgJiYgbm9kZXMuaW5kZXhPZihub2RlKSA8IDApIHtcclxuXHRcdFx0XHRjbGVhcihbbm9kZV0sIFtjYWNoZWRbaV1dKVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHRcdGlmIChkYXRhLmxlbmd0aCA8IGNhY2hlZC5sZW5ndGgpIGNhY2hlZC5sZW5ndGggPSBkYXRhLmxlbmd0aFxyXG5cdFx0Y2FjaGVkLm5vZGVzID0gbm9kZXNcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkQXJyYXlLZXlzKGRhdGEpIHtcclxuXHRcdHZhciBndWlkID0gMFxyXG5cdFx0Zm9yS2V5cyhkYXRhLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGZvckVhY2goZGF0YSwgZnVuY3Rpb24gKGF0dHJzKSB7XHJcblx0XHRcdFx0aWYgKChhdHRycyA9IGF0dHJzICYmIGF0dHJzLmF0dHJzKSAmJiBhdHRycy5rZXkgPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0YXR0cnMua2V5ID0gXCJfX21pdGhyaWxfX1wiICsgZ3VpZCsrXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHRyZXR1cm4gMVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGlzRGlmZmVyZW50RW5vdWdoKGRhdGEsIGNhY2hlZCwgZGF0YUF0dHJLZXlzKSB7XHJcblx0XHRpZiAoZGF0YS50YWcgIT09IGNhY2hlZC50YWcpIHJldHVybiB0cnVlXHJcblxyXG5cdFx0aWYgKGRhdGFBdHRyS2V5cy5zb3J0KCkuam9pbigpICE9PVxyXG5cdFx0XHRcdE9iamVjdC5rZXlzKGNhY2hlZC5hdHRycykuc29ydCgpLmpvaW4oKSkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkYXRhLmF0dHJzLmlkICE9PSBjYWNoZWQuYXR0cnMuaWQpIHtcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGF0YS5hdHRycy5rZXkgIT09IGNhY2hlZC5hdHRycy5rZXkpIHtcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobS5yZWRyYXcuc3RyYXRlZ3koKSA9PT0gXCJhbGxcIikge1xyXG5cdFx0XHRyZXR1cm4gIWNhY2hlZC5jb25maWdDb250ZXh0IHx8IGNhY2hlZC5jb25maWdDb250ZXh0LnJldGFpbiAhPT0gdHJ1ZVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChtLnJlZHJhdy5zdHJhdGVneSgpID09PSBcImRpZmZcIikge1xyXG5cdFx0XHRyZXR1cm4gY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgY2FjaGVkLmNvbmZpZ0NvbnRleHQucmV0YWluID09PSBmYWxzZVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbWF5YmVSZWNyZWF0ZU9iamVjdChkYXRhLCBjYWNoZWQsIGRhdGFBdHRyS2V5cykge1xyXG5cdFx0Ly8gaWYgYW4gZWxlbWVudCBpcyBkaWZmZXJlbnQgZW5vdWdoIGZyb20gdGhlIG9uZSBpbiBjYWNoZSwgcmVjcmVhdGUgaXRcclxuXHRcdGlmIChpc0RpZmZlcmVudEVub3VnaChkYXRhLCBjYWNoZWQsIGRhdGFBdHRyS2V5cykpIHtcclxuXHRcdFx0aWYgKGNhY2hlZC5ub2Rlcy5sZW5ndGgpIGNsZWFyKGNhY2hlZC5ub2RlcylcclxuXHJcblx0XHRcdGlmIChjYWNoZWQuY29uZmlnQ29udGV4dCAmJlxyXG5cdFx0XHRcdFx0aXNGdW5jdGlvbihjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCkpIHtcclxuXHRcdFx0XHRjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCgpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChjYWNoZWQuY29udHJvbGxlcnMpIHtcclxuXHRcdFx0XHRmb3JFYWNoKGNhY2hlZC5jb250cm9sbGVycywgZnVuY3Rpb24gKGNvbnRyb2xsZXIpIHtcclxuXHRcdFx0XHRcdGlmIChjb250cm9sbGVyLm9udW5sb2FkKSB7XHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRPYmplY3ROYW1lc3BhY2UoZGF0YSwgbmFtZXNwYWNlKSB7XHJcblx0XHRpZiAoZGF0YS5hdHRycy54bWxucykgcmV0dXJuIGRhdGEuYXR0cnMueG1sbnNcclxuXHRcdGlmIChkYXRhLnRhZyA9PT0gXCJzdmdcIikgcmV0dXJuIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG5cdFx0aWYgKGRhdGEudGFnID09PSBcIm1hdGhcIikgcmV0dXJuIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiXHJcblx0XHRyZXR1cm4gbmFtZXNwYWNlXHJcblx0fVxyXG5cclxuXHR2YXIgcGVuZGluZ1JlcXVlc3RzID0gMFxyXG5cdG0uc3RhcnRDb21wdXRhdGlvbiA9IGZ1bmN0aW9uICgpIHsgcGVuZGluZ1JlcXVlc3RzKysgfVxyXG5cdG0uZW5kQ29tcHV0YXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAocGVuZGluZ1JlcXVlc3RzID4gMSkge1xyXG5cdFx0XHRwZW5kaW5nUmVxdWVzdHMtLVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cGVuZGluZ1JlcXVlc3RzID0gMFxyXG5cdFx0XHRtLnJlZHJhdygpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB1bmxvYWRDYWNoZWRDb250cm9sbGVycyhjYWNoZWQsIHZpZXdzLCBjb250cm9sbGVycykge1xyXG5cdFx0aWYgKGNvbnRyb2xsZXJzLmxlbmd0aCkge1xyXG5cdFx0XHRjYWNoZWQudmlld3MgPSB2aWV3c1xyXG5cdFx0XHRjYWNoZWQuY29udHJvbGxlcnMgPSBjb250cm9sbGVyc1xyXG5cdFx0XHRmb3JFYWNoKGNvbnRyb2xsZXJzLCBmdW5jdGlvbiAoY29udHJvbGxlcikge1xyXG5cdFx0XHRcdGlmIChjb250cm9sbGVyLm9udW5sb2FkICYmIGNvbnRyb2xsZXIub251bmxvYWQuJG9sZCkge1xyXG5cdFx0XHRcdFx0Y29udHJvbGxlci5vbnVubG9hZCA9IGNvbnRyb2xsZXIub251bmxvYWQuJG9sZFxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHBlbmRpbmdSZXF1ZXN0cyAmJiBjb250cm9sbGVyLm9udW5sb2FkKSB7XHJcblx0XHRcdFx0XHR2YXIgb251bmxvYWQgPSBjb250cm9sbGVyLm9udW5sb2FkXHJcblx0XHRcdFx0XHRjb250cm9sbGVyLm9udW5sb2FkID0gbm9vcFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlci5vbnVubG9hZC4kb2xkID0gb251bmxvYWRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzY2hlZHVsZUNvbmZpZ3NUb0JlQ2FsbGVkKGNvbmZpZ3MsIGRhdGEsIG5vZGUsIGlzTmV3LCBjYWNoZWQpIHtcclxuXHRcdC8vIHNjaGVkdWxlIGNvbmZpZ3MgdG8gYmUgY2FsbGVkLiBUaGV5IGFyZSBjYWxsZWQgYWZ0ZXIgYGJ1aWxkYCBmaW5pc2hlc1xyXG5cdFx0Ly8gcnVubmluZ1xyXG5cdFx0aWYgKGlzRnVuY3Rpb24oZGF0YS5hdHRycy5jb25maWcpKSB7XHJcblx0XHRcdHZhciBjb250ZXh0ID0gY2FjaGVkLmNvbmZpZ0NvbnRleHQgPSBjYWNoZWQuY29uZmlnQ29udGV4dCB8fCB7fVxyXG5cclxuXHRcdFx0Ly8gYmluZFxyXG5cdFx0XHRjb25maWdzLnB1c2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhLmF0dHJzLmNvbmZpZy5jYWxsKGRhdGEsIG5vZGUsICFpc05ldywgY29udGV4dCxcclxuXHRcdFx0XHRcdGNhY2hlZClcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkVXBkYXRlZE5vZGUoXHJcblx0XHRjYWNoZWQsXHJcblx0XHRkYXRhLFxyXG5cdFx0ZWRpdGFibGUsXHJcblx0XHRoYXNLZXlzLFxyXG5cdFx0bmFtZXNwYWNlLFxyXG5cdFx0dmlld3MsXHJcblx0XHRjb25maWdzLFxyXG5cdFx0Y29udHJvbGxlcnNcclxuXHQpIHtcclxuXHRcdHZhciBub2RlID0gY2FjaGVkLm5vZGVzWzBdXHJcblxyXG5cdFx0aWYgKGhhc0tleXMpIHtcclxuXHRcdFx0c2V0QXR0cmlidXRlcyhub2RlLCBkYXRhLnRhZywgZGF0YS5hdHRycywgY2FjaGVkLmF0dHJzLCBuYW1lc3BhY2UpXHJcblx0XHR9XHJcblxyXG5cdFx0Y2FjaGVkLmNoaWxkcmVuID0gYnVpbGQoXHJcblx0XHRcdG5vZGUsXHJcblx0XHRcdGRhdGEudGFnLFxyXG5cdFx0XHR1bmRlZmluZWQsXHJcblx0XHRcdHVuZGVmaW5lZCxcclxuXHRcdFx0ZGF0YS5jaGlsZHJlbixcclxuXHRcdFx0Y2FjaGVkLmNoaWxkcmVuLFxyXG5cdFx0XHRmYWxzZSxcclxuXHRcdFx0MCxcclxuXHRcdFx0ZGF0YS5hdHRycy5jb250ZW50ZWRpdGFibGUgPyBub2RlIDogZWRpdGFibGUsXHJcblx0XHRcdG5hbWVzcGFjZSxcclxuXHRcdFx0Y29uZmlnc1xyXG5cdFx0KVxyXG5cclxuXHRcdGNhY2hlZC5ub2Rlcy5pbnRhY3QgPSB0cnVlXHJcblxyXG5cdFx0aWYgKGNvbnRyb2xsZXJzLmxlbmd0aCkge1xyXG5cdFx0XHRjYWNoZWQudmlld3MgPSB2aWV3c1xyXG5cdFx0XHRjYWNoZWQuY29udHJvbGxlcnMgPSBjb250cm9sbGVyc1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBub2RlXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBoYW5kbGVOb25leGlzdGVudE5vZGVzKGRhdGEsIHBhcmVudEVsZW1lbnQsIGluZGV4KSB7XHJcblx0XHR2YXIgbm9kZXNcclxuXHRcdGlmIChkYXRhLiR0cnVzdGVkKSB7XHJcblx0XHRcdG5vZGVzID0gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG5vZGVzID0gWyRkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKV1cclxuXHRcdFx0aWYgKCEocGFyZW50RWxlbWVudC5ub2RlTmFtZSBpbiB2b2lkRWxlbWVudHMpKSB7XHJcblx0XHRcdFx0aW5zZXJ0Tm9kZShwYXJlbnRFbGVtZW50LCBub2Rlc1swXSwgaW5kZXgpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2FjaGVkXHJcblxyXG5cdFx0aWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiIHx8XHJcblx0XHRcdFx0dHlwZW9mIGRhdGEgPT09IFwibnVtYmVyXCIgfHxcclxuXHRcdFx0XHR0eXBlb2YgZGF0YSA9PT0gXCJib29sZWFuXCIpIHtcclxuXHRcdFx0Y2FjaGVkID0gbmV3IGRhdGEuY29uc3RydWN0b3IoZGF0YSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNhY2hlZCA9IGRhdGFcclxuXHRcdH1cclxuXHJcblx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0cmV0dXJuIGNhY2hlZFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmVhdHRhY2hOb2RlcyhcclxuXHRcdGRhdGEsXHJcblx0XHRjYWNoZWQsXHJcblx0XHRwYXJlbnRFbGVtZW50LFxyXG5cdFx0ZWRpdGFibGUsXHJcblx0XHRpbmRleCxcclxuXHRcdHBhcmVudFRhZ1xyXG5cdCkge1xyXG5cdFx0dmFyIG5vZGVzID0gY2FjaGVkLm5vZGVzXHJcblx0XHRpZiAoIWVkaXRhYmxlIHx8IGVkaXRhYmxlICE9PSAkZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xyXG5cdFx0XHRpZiAoZGF0YS4kdHJ1c3RlZCkge1xyXG5cdFx0XHRcdGNsZWFyKG5vZGVzLCBjYWNoZWQpXHJcblx0XHRcdFx0bm9kZXMgPSBpbmplY3RIVE1MKHBhcmVudEVsZW1lbnQsIGluZGV4LCBkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHBhcmVudFRhZyA9PT0gXCJ0ZXh0YXJlYVwiKSB7XHJcblx0XHRcdFx0Ly8gPHRleHRhcmVhPiB1c2VzIGB2YWx1ZWAgaW5zdGVhZCBvZiBgbm9kZVZhbHVlYC5cclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50LnZhbHVlID0gZGF0YVxyXG5cdFx0XHR9IGVsc2UgaWYgKGVkaXRhYmxlKSB7XHJcblx0XHRcdFx0Ly8gY29udGVudGVkaXRhYmxlIG5vZGVzIHVzZSBgaW5uZXJIVE1MYCBpbnN0ZWFkIG9mIGBub2RlVmFsdWVgLlxyXG5cdFx0XHRcdGVkaXRhYmxlLmlubmVySFRNTCA9IGRhdGFcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyB3YXMgYSB0cnVzdGVkIHN0cmluZ1xyXG5cdFx0XHRcdGlmIChub2Rlc1swXS5ub2RlVHlwZSA9PT0gMSB8fCBub2Rlcy5sZW5ndGggPiAxIHx8XHJcblx0XHRcdFx0XHRcdChub2Rlc1swXS5ub2RlVmFsdWUudHJpbSAmJlxyXG5cdFx0XHRcdFx0XHRcdCFub2Rlc1swXS5ub2RlVmFsdWUudHJpbSgpKSkge1xyXG5cdFx0XHRcdFx0Y2xlYXIoY2FjaGVkLm5vZGVzLCBjYWNoZWQpXHJcblx0XHRcdFx0XHRub2RlcyA9IFskZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSldXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpbmplY3RUZXh0Tm9kZShwYXJlbnRFbGVtZW50LCBub2Rlc1swXSwgaW5kZXgsIGRhdGEpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGNhY2hlZCA9IG5ldyBkYXRhLmNvbnN0cnVjdG9yKGRhdGEpXHJcblx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0cmV0dXJuIGNhY2hlZFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaGFuZGxlVGV4dE5vZGUoXHJcblx0XHRjYWNoZWQsXHJcblx0XHRkYXRhLFxyXG5cdFx0aW5kZXgsXHJcblx0XHRwYXJlbnRFbGVtZW50LFxyXG5cdFx0c2hvdWxkUmVhdHRhY2gsXHJcblx0XHRlZGl0YWJsZSxcclxuXHRcdHBhcmVudFRhZ1xyXG5cdCkge1xyXG5cdFx0aWYgKCFjYWNoZWQubm9kZXMubGVuZ3RoKSB7XHJcblx0XHRcdHJldHVybiBoYW5kbGVOb25leGlzdGVudE5vZGVzKGRhdGEsIHBhcmVudEVsZW1lbnQsIGluZGV4KVxyXG5cdFx0fSBlbHNlIGlmIChjYWNoZWQudmFsdWVPZigpICE9PSBkYXRhLnZhbHVlT2YoKSB8fCBzaG91bGRSZWF0dGFjaCkge1xyXG5cdFx0XHRyZXR1cm4gcmVhdHRhY2hOb2RlcyhkYXRhLCBjYWNoZWQsIHBhcmVudEVsZW1lbnQsIGVkaXRhYmxlLCBpbmRleCxcclxuXHRcdFx0XHRwYXJlbnRUYWcpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gKGNhY2hlZC5ub2Rlcy5pbnRhY3QgPSB0cnVlLCBjYWNoZWQpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRTdWJBcnJheUNvdW50KGl0ZW0pIHtcclxuXHRcdGlmIChpdGVtLiR0cnVzdGVkKSB7XHJcblx0XHRcdC8vIGZpeCBvZmZzZXQgb2YgbmV4dCBlbGVtZW50IGlmIGl0ZW0gd2FzIGEgdHJ1c3RlZCBzdHJpbmcgdy8gbW9yZVxyXG5cdFx0XHQvLyB0aGFuIG9uZSBodG1sIGVsZW1lbnRcclxuXHRcdFx0Ly8gdGhlIGZpcnN0IGNsYXVzZSBpbiB0aGUgcmVnZXhwIG1hdGNoZXMgZWxlbWVudHNcclxuXHRcdFx0Ly8gdGhlIHNlY29uZCBjbGF1c2UgKGFmdGVyIHRoZSBwaXBlKSBtYXRjaGVzIHRleHQgbm9kZXNcclxuXHRcdFx0dmFyIG1hdGNoID0gaXRlbS5tYXRjaCgvPFteXFwvXXxcXD5cXHMqW148XS9nKVxyXG5cdFx0XHRpZiAobWF0Y2ggIT0gbnVsbCkgcmV0dXJuIG1hdGNoLmxlbmd0aFxyXG5cdFx0fSBlbHNlIGlmIChpc0FycmF5KGl0ZW0pKSB7XHJcblx0XHRcdHJldHVybiBpdGVtLmxlbmd0aFxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIDFcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkQXJyYXkoXHJcblx0XHRkYXRhLFxyXG5cdFx0Y2FjaGVkLFxyXG5cdFx0cGFyZW50RWxlbWVudCxcclxuXHRcdGluZGV4LFxyXG5cdFx0cGFyZW50VGFnLFxyXG5cdFx0c2hvdWxkUmVhdHRhY2gsXHJcblx0XHRlZGl0YWJsZSxcclxuXHRcdG5hbWVzcGFjZSxcclxuXHRcdGNvbmZpZ3NcclxuXHQpIHtcclxuXHRcdGRhdGEgPSBmbGF0dGVuKGRhdGEpXHJcblx0XHR2YXIgbm9kZXMgPSBbXVxyXG5cdFx0dmFyIGludGFjdCA9IGNhY2hlZC5sZW5ndGggPT09IGRhdGEubGVuZ3RoXHJcblx0XHR2YXIgc3ViQXJyYXlDb3VudCA9IDBcclxuXHJcblx0XHQvLyBrZXlzIGFsZ29yaXRobTogc29ydCBlbGVtZW50cyB3aXRob3V0IHJlY3JlYXRpbmcgdGhlbSBpZiBrZXlzIGFyZVxyXG5cdFx0Ly8gcHJlc2VudFxyXG5cdFx0Ly9cclxuXHRcdC8vIDEpIGNyZWF0ZSBhIG1hcCBvZiBhbGwgZXhpc3Rpbmcga2V5cywgYW5kIG1hcmsgYWxsIGZvciBkZWxldGlvblxyXG5cdFx0Ly8gMikgYWRkIG5ldyBrZXlzIHRvIG1hcCBhbmQgbWFyayB0aGVtIGZvciBhZGRpdGlvblxyXG5cdFx0Ly8gMykgaWYga2V5IGV4aXN0cyBpbiBuZXcgbGlzdCwgY2hhbmdlIGFjdGlvbiBmcm9tIGRlbGV0aW9uIHRvIGEgbW92ZVxyXG5cdFx0Ly8gNCkgZm9yIGVhY2gga2V5LCBoYW5kbGUgaXRzIGNvcnJlc3BvbmRpbmcgYWN0aW9uIGFzIG1hcmtlZCBpblxyXG5cdFx0Ly8gICAgcHJldmlvdXMgc3RlcHNcclxuXHJcblx0XHR2YXIgZXhpc3RpbmcgPSB7fVxyXG5cdFx0dmFyIHNob3VsZE1haW50YWluSWRlbnRpdGllcyA9IGZhbHNlXHJcblxyXG5cdFx0Zm9yS2V5cyhjYWNoZWQsIGZ1bmN0aW9uIChhdHRycywgaSkge1xyXG5cdFx0XHRzaG91bGRNYWludGFpbklkZW50aXRpZXMgPSB0cnVlXHJcblx0XHRcdGV4aXN0aW5nW2NhY2hlZFtpXS5hdHRycy5rZXldID0ge2FjdGlvbjogREVMRVRJT04sIGluZGV4OiBpfVxyXG5cdFx0fSlcclxuXHJcblx0XHRidWlsZEFycmF5S2V5cyhkYXRhKVxyXG5cdFx0aWYgKHNob3VsZE1haW50YWluSWRlbnRpdGllcykge1xyXG5cdFx0XHRjYWNoZWQgPSBkaWZmS2V5cyhkYXRhLCBjYWNoZWQsIGV4aXN0aW5nLCBwYXJlbnRFbGVtZW50KVxyXG5cdFx0fVxyXG5cdFx0Ly8gZW5kIGtleSBhbGdvcml0aG1cclxuXHJcblx0XHR2YXIgY2FjaGVDb3VudCA9IDBcclxuXHRcdC8vIGZhc3RlciBleHBsaWNpdGx5IHdyaXR0ZW5cclxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdC8vIGRpZmYgZWFjaCBpdGVtIGluIHRoZSBhcnJheVxyXG5cdFx0XHR2YXIgaXRlbSA9IGJ1aWxkKFxyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQsXHJcblx0XHRcdFx0cGFyZW50VGFnLFxyXG5cdFx0XHRcdGNhY2hlZCxcclxuXHRcdFx0XHRpbmRleCxcclxuXHRcdFx0XHRkYXRhW2ldLFxyXG5cdFx0XHRcdGNhY2hlZFtjYWNoZUNvdW50XSxcclxuXHRcdFx0XHRzaG91bGRSZWF0dGFjaCxcclxuXHRcdFx0XHRpbmRleCArIHN1YkFycmF5Q291bnQgfHwgc3ViQXJyYXlDb3VudCxcclxuXHRcdFx0XHRlZGl0YWJsZSxcclxuXHRcdFx0XHRuYW1lc3BhY2UsXHJcblx0XHRcdFx0Y29uZmlncylcclxuXHJcblx0XHRcdGlmIChpdGVtICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRpbnRhY3QgPSBpbnRhY3QgJiYgaXRlbS5ub2Rlcy5pbnRhY3RcclxuXHRcdFx0XHRzdWJBcnJheUNvdW50ICs9IGdldFN1YkFycmF5Q291bnQoaXRlbSlcclxuXHRcdFx0XHRjYWNoZWRbY2FjaGVDb3VudCsrXSA9IGl0ZW1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghaW50YWN0KSBkaWZmQXJyYXkoZGF0YSwgY2FjaGVkLCBub2RlcylcclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG1ha2VDYWNoZShkYXRhLCBjYWNoZWQsIGluZGV4LCBwYXJlbnRJbmRleCwgcGFyZW50Q2FjaGUpIHtcclxuXHRcdGlmIChjYWNoZWQgIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAodHlwZS5jYWxsKGNhY2hlZCkgPT09IHR5cGUuY2FsbChkYXRhKSkgcmV0dXJuIGNhY2hlZFxyXG5cclxuXHRcdFx0aWYgKHBhcmVudENhY2hlICYmIHBhcmVudENhY2hlLm5vZGVzKSB7XHJcblx0XHRcdFx0dmFyIG9mZnNldCA9IGluZGV4IC0gcGFyZW50SW5kZXhcclxuXHRcdFx0XHR2YXIgZW5kID0gb2Zmc2V0ICsgKGlzQXJyYXkoZGF0YSkgPyBkYXRhIDogY2FjaGVkLm5vZGVzKS5sZW5ndGhcclxuXHRcdFx0XHRjbGVhcihcclxuXHRcdFx0XHRcdHBhcmVudENhY2hlLm5vZGVzLnNsaWNlKG9mZnNldCwgZW5kKSxcclxuXHRcdFx0XHRcdHBhcmVudENhY2hlLnNsaWNlKG9mZnNldCwgZW5kKSlcclxuXHRcdFx0fSBlbHNlIGlmIChjYWNoZWQubm9kZXMpIHtcclxuXHRcdFx0XHRjbGVhcihjYWNoZWQubm9kZXMsIGNhY2hlZClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNhY2hlZCA9IG5ldyBkYXRhLmNvbnN0cnVjdG9yKClcclxuXHRcdC8vIGlmIGNvbnN0cnVjdG9yIGNyZWF0ZXMgYSB2aXJ0dWFsIGRvbSBlbGVtZW50LCB1c2UgYSBibGFuayBvYmplY3QgYXNcclxuXHRcdC8vIHRoZSBiYXNlIGNhY2hlZCBub2RlIGluc3RlYWQgb2YgY29weWluZyB0aGUgdmlydHVhbCBlbCAoIzI3NylcclxuXHRcdGlmIChjYWNoZWQudGFnKSBjYWNoZWQgPSB7fVxyXG5cdFx0Y2FjaGVkLm5vZGVzID0gW11cclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNvbnN0cnVjdE5vZGUoZGF0YSwgbmFtZXNwYWNlKSB7XHJcblx0XHRpZiAoZGF0YS5hdHRycy5pcykge1xyXG5cdFx0XHRpZiAobmFtZXNwYWNlID09IG51bGwpIHtcclxuXHRcdFx0XHRyZXR1cm4gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YS50YWcsIGRhdGEuYXR0cnMuaXMpXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuICRkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlLCBkYXRhLnRhZyxcclxuXHRcdFx0XHRcdGRhdGEuYXR0cnMuaXMpXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAobmFtZXNwYWNlID09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEudGFnKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuICRkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlLCBkYXRhLnRhZylcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNvbnN0cnVjdEF0dHJzKGRhdGEsIG5vZGUsIG5hbWVzcGFjZSwgaGFzS2V5cykge1xyXG5cdFx0aWYgKGhhc0tleXMpIHtcclxuXHRcdFx0cmV0dXJuIHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMsIHt9LCBuYW1lc3BhY2UpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gZGF0YS5hdHRyc1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY29uc3RydWN0Q2hpbGRyZW4oXHJcblx0XHRkYXRhLFxyXG5cdFx0bm9kZSxcclxuXHRcdGNhY2hlZCxcclxuXHRcdGVkaXRhYmxlLFxyXG5cdFx0bmFtZXNwYWNlLFxyXG5cdFx0Y29uZmlnc1xyXG5cdCkge1xyXG5cdFx0aWYgKGRhdGEuY2hpbGRyZW4gIT0gbnVsbCAmJiBkYXRhLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0cmV0dXJuIGJ1aWxkKFxyXG5cdFx0XHRcdG5vZGUsXHJcblx0XHRcdFx0ZGF0YS50YWcsXHJcblx0XHRcdFx0dW5kZWZpbmVkLFxyXG5cdFx0XHRcdHVuZGVmaW5lZCxcclxuXHRcdFx0XHRkYXRhLmNoaWxkcmVuLFxyXG5cdFx0XHRcdGNhY2hlZC5jaGlsZHJlbixcclxuXHRcdFx0XHR0cnVlLFxyXG5cdFx0XHRcdDAsXHJcblx0XHRcdFx0ZGF0YS5hdHRycy5jb250ZW50ZWRpdGFibGUgPyBub2RlIDogZWRpdGFibGUsXHJcblx0XHRcdFx0bmFtZXNwYWNlLFxyXG5cdFx0XHRcdGNvbmZpZ3MpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gZGF0YS5jaGlsZHJlblxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmVjb25zdHJ1Y3RDYWNoZWQoXHJcblx0XHRkYXRhLFxyXG5cdFx0YXR0cnMsXHJcblx0XHRjaGlsZHJlbixcclxuXHRcdG5vZGUsXHJcblx0XHRuYW1lc3BhY2UsXHJcblx0XHR2aWV3cyxcclxuXHRcdGNvbnRyb2xsZXJzXHJcblx0KSB7XHJcblx0XHR2YXIgY2FjaGVkID0ge1xyXG5cdFx0XHR0YWc6IGRhdGEudGFnLFxyXG5cdFx0XHRhdHRyczogYXR0cnMsXHJcblx0XHRcdGNoaWxkcmVuOiBjaGlsZHJlbixcclxuXHRcdFx0bm9kZXM6IFtub2RlXVxyXG5cdFx0fVxyXG5cclxuXHRcdHVubG9hZENhY2hlZENvbnRyb2xsZXJzKGNhY2hlZCwgdmlld3MsIGNvbnRyb2xsZXJzKVxyXG5cclxuXHRcdGlmIChjYWNoZWQuY2hpbGRyZW4gJiYgIWNhY2hlZC5jaGlsZHJlbi5ub2Rlcykge1xyXG5cdFx0XHRjYWNoZWQuY2hpbGRyZW4ubm9kZXMgPSBbXVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGVkZ2UgY2FzZTogc2V0dGluZyB2YWx1ZSBvbiA8c2VsZWN0PiBkb2Vzbid0IHdvcmsgYmVmb3JlIGNoaWxkcmVuXHJcblx0XHQvLyBleGlzdCwgc28gc2V0IGl0IGFnYWluIGFmdGVyIGNoaWxkcmVuIGhhdmUgYmVlbiBjcmVhdGVkXHJcblx0XHRpZiAoZGF0YS50YWcgPT09IFwic2VsZWN0XCIgJiYgXCJ2YWx1ZVwiIGluIGRhdGEuYXR0cnMpIHtcclxuXHRcdFx0c2V0QXR0cmlidXRlcyhub2RlLCBkYXRhLnRhZywge3ZhbHVlOiBkYXRhLmF0dHJzLnZhbHVlfSwge30sXHJcblx0XHRcdFx0bmFtZXNwYWNlKVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldENvbnRyb2xsZXIodmlld3MsIHZpZXcsIGNhY2hlZENvbnRyb2xsZXJzLCBjb250cm9sbGVyKSB7XHJcblx0XHR2YXIgY29udHJvbGxlckluZGV4XHJcblxyXG5cdFx0aWYgKG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT09IFwiZGlmZlwiICYmIHZpZXdzKSB7XHJcblx0XHRcdGNvbnRyb2xsZXJJbmRleCA9IHZpZXdzLmluZGV4T2YodmlldylcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnRyb2xsZXJJbmRleCA9IC0xXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNvbnRyb2xsZXJJbmRleCA+IC0xKSB7XHJcblx0XHRcdHJldHVybiBjYWNoZWRDb250cm9sbGVyc1tjb250cm9sbGVySW5kZXhdXHJcblx0XHR9IGVsc2UgaWYgKGlzRnVuY3Rpb24oY29udHJvbGxlcikpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBjb250cm9sbGVyKClcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB7fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIHVubG9hZGVycyA9IFtdXHJcblxyXG5cdGZ1bmN0aW9uIHVwZGF0ZUxpc3RzKHZpZXdzLCBjb250cm9sbGVycywgdmlldywgY29udHJvbGxlcikge1xyXG5cdFx0aWYgKGNvbnRyb2xsZXIub251bmxvYWQgIT0gbnVsbCAmJlxyXG5cdFx0XHRcdHVubG9hZGVycy5tYXAoZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHUuaGFuZGxlciB9KVxyXG5cdFx0XHRcdFx0LmluZGV4T2YoY29udHJvbGxlci5vbnVubG9hZCkgPCAwKSB7XHJcblx0XHRcdHVubG9hZGVycy5wdXNoKHtcclxuXHRcdFx0XHRjb250cm9sbGVyOiBjb250cm9sbGVyLFxyXG5cdFx0XHRcdGhhbmRsZXI6IGNvbnRyb2xsZXIub251bmxvYWRcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHR2aWV3cy5wdXNoKHZpZXcpXHJcblx0XHRjb250cm9sbGVycy5wdXNoKGNvbnRyb2xsZXIpXHJcblx0fVxyXG5cclxuXHR2YXIgZm9yY2luZyA9IGZhbHNlXHJcblx0ZnVuY3Rpb24gY2hlY2tWaWV3KFxyXG5cdFx0ZGF0YSxcclxuXHRcdHZpZXcsXHJcblx0XHRjYWNoZWQsXHJcblx0XHRjYWNoZWRDb250cm9sbGVycyxcclxuXHRcdGNvbnRyb2xsZXJzLFxyXG5cdFx0dmlld3NcclxuXHQpIHtcclxuXHRcdHZhciBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihcclxuXHRcdFx0Y2FjaGVkLnZpZXdzLFxyXG5cdFx0XHR2aWV3LFxyXG5cdFx0XHRjYWNoZWRDb250cm9sbGVycyxcclxuXHRcdFx0ZGF0YS5jb250cm9sbGVyKVxyXG5cclxuXHRcdHZhciBrZXkgPSBkYXRhICYmIGRhdGEuYXR0cnMgJiYgZGF0YS5hdHRycy5rZXlcclxuXHJcblx0XHRpZiAocGVuZGluZ1JlcXVlc3RzID09PSAwIHx8XHJcblx0XHRcdFx0Zm9yY2luZyB8fFxyXG5cdFx0XHRcdGNhY2hlZENvbnRyb2xsZXJzICYmXHJcblx0XHRcdFx0XHRjYWNoZWRDb250cm9sbGVycy5pbmRleE9mKGNvbnRyb2xsZXIpID4gLTEpIHtcclxuXHRcdFx0ZGF0YSA9IGRhdGEudmlldyhjb250cm9sbGVyKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGF0YSA9IHt0YWc6IFwicGxhY2Vob2xkZXJcIn1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGF0YS5zdWJ0cmVlID09PSBcInJldGFpblwiKSByZXR1cm4gZGF0YVxyXG5cdFx0ZGF0YS5hdHRycyA9IGRhdGEuYXR0cnMgfHwge31cclxuXHRcdGRhdGEuYXR0cnMua2V5ID0ga2V5XHJcblx0XHR1cGRhdGVMaXN0cyh2aWV3cywgY29udHJvbGxlcnMsIHZpZXcsIGNvbnRyb2xsZXIpXHJcblx0XHRyZXR1cm4gZGF0YVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbWFya1ZpZXdzKGRhdGEsIGNhY2hlZCwgdmlld3MsIGNvbnRyb2xsZXJzKSB7XHJcblx0XHR2YXIgY2FjaGVkQ29udHJvbGxlcnMgPSBjYWNoZWQgJiYgY2FjaGVkLmNvbnRyb2xsZXJzXHJcblxyXG5cdFx0d2hpbGUgKGRhdGEudmlldyAhPSBudWxsKSB7XHJcblx0XHRcdGRhdGEgPSBjaGVja1ZpZXcoXHJcblx0XHRcdFx0ZGF0YSxcclxuXHRcdFx0XHRkYXRhLnZpZXcuJG9yaWdpbmFsIHx8IGRhdGEudmlldyxcclxuXHRcdFx0XHRjYWNoZWQsXHJcblx0XHRcdFx0Y2FjaGVkQ29udHJvbGxlcnMsXHJcblx0XHRcdFx0Y29udHJvbGxlcnMsXHJcblx0XHRcdFx0dmlld3MpXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGFcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkT2JqZWN0KCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1zdGF0ZW1lbnRzXHJcblx0XHRkYXRhLFxyXG5cdFx0Y2FjaGVkLFxyXG5cdFx0ZWRpdGFibGUsXHJcblx0XHRwYXJlbnRFbGVtZW50LFxyXG5cdFx0aW5kZXgsXHJcblx0XHRzaG91bGRSZWF0dGFjaCxcclxuXHRcdG5hbWVzcGFjZSxcclxuXHRcdGNvbmZpZ3NcclxuXHQpIHtcclxuXHRcdHZhciB2aWV3cyA9IFtdXHJcblx0XHR2YXIgY29udHJvbGxlcnMgPSBbXVxyXG5cclxuXHRcdGRhdGEgPSBtYXJrVmlld3MoZGF0YSwgY2FjaGVkLCB2aWV3cywgY29udHJvbGxlcnMpXHJcblxyXG5cdFx0aWYgKGRhdGEuc3VidHJlZSA9PT0gXCJyZXRhaW5cIikgcmV0dXJuIGNhY2hlZFxyXG5cclxuXHRcdGlmICghZGF0YS50YWcgJiYgY29udHJvbGxlcnMubGVuZ3RoKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCB0ZW1wbGF0ZSBtdXN0IHJldHVybiBhIHZpcnR1YWwgXCIgK1xyXG5cdFx0XHRcdFwiZWxlbWVudCwgbm90IGFuIGFycmF5LCBzdHJpbmcsIGV0Yy5cIilcclxuXHRcdH1cclxuXHJcblx0XHRkYXRhLmF0dHJzID0gZGF0YS5hdHRycyB8fCB7fVxyXG5cdFx0Y2FjaGVkLmF0dHJzID0gY2FjaGVkLmF0dHJzIHx8IHt9XHJcblxyXG5cdFx0dmFyIGRhdGFBdHRyS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEuYXR0cnMpXHJcblx0XHR2YXIgaGFzS2V5cyA9IGRhdGFBdHRyS2V5cy5sZW5ndGggPiAoXCJrZXlcIiBpbiBkYXRhLmF0dHJzID8gMSA6IDApXHJcblxyXG5cdFx0bWF5YmVSZWNyZWF0ZU9iamVjdChkYXRhLCBjYWNoZWQsIGRhdGFBdHRyS2V5cylcclxuXHJcblx0XHRpZiAoIWlzU3RyaW5nKGRhdGEudGFnKSkgcmV0dXJuXHJcblxyXG5cdFx0dmFyIGlzTmV3ID0gY2FjaGVkLm5vZGVzLmxlbmd0aCA9PT0gMFxyXG5cclxuXHRcdG5hbWVzcGFjZSA9IGdldE9iamVjdE5hbWVzcGFjZShkYXRhLCBuYW1lc3BhY2UpXHJcblxyXG5cdFx0dmFyIG5vZGVcclxuXHRcdGlmIChpc05ldykge1xyXG5cdFx0XHRub2RlID0gY29uc3RydWN0Tm9kZShkYXRhLCBuYW1lc3BhY2UpXHJcblx0XHRcdC8vIHNldCBhdHRyaWJ1dGVzIGZpcnN0LCB0aGVuIGNyZWF0ZSBjaGlsZHJlblxyXG5cdFx0XHR2YXIgYXR0cnMgPSBjb25zdHJ1Y3RBdHRycyhkYXRhLCBub2RlLCBuYW1lc3BhY2UsIGhhc0tleXMpXHJcblxyXG5cdFx0XHR2YXIgY2hpbGRyZW4gPSBjb25zdHJ1Y3RDaGlsZHJlbihkYXRhLCBub2RlLCBjYWNoZWQsIGVkaXRhYmxlLFxyXG5cdFx0XHRcdG5hbWVzcGFjZSwgY29uZmlncylcclxuXHJcblx0XHRcdGNhY2hlZCA9IHJlY29uc3RydWN0Q2FjaGVkKFxyXG5cdFx0XHRcdGRhdGEsXHJcblx0XHRcdFx0YXR0cnMsXHJcblx0XHRcdFx0Y2hpbGRyZW4sXHJcblx0XHRcdFx0bm9kZSxcclxuXHRcdFx0XHRuYW1lc3BhY2UsXHJcblx0XHRcdFx0dmlld3MsXHJcblx0XHRcdFx0Y29udHJvbGxlcnMpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRub2RlID0gYnVpbGRVcGRhdGVkTm9kZShcclxuXHRcdFx0XHRjYWNoZWQsXHJcblx0XHRcdFx0ZGF0YSxcclxuXHRcdFx0XHRlZGl0YWJsZSxcclxuXHRcdFx0XHRoYXNLZXlzLFxyXG5cdFx0XHRcdG5hbWVzcGFjZSxcclxuXHRcdFx0XHR2aWV3cyxcclxuXHRcdFx0XHRjb25maWdzLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXJzKVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpc05ldyB8fCBzaG91bGRSZWF0dGFjaCA9PT0gdHJ1ZSAmJiBub2RlICE9IG51bGwpIHtcclxuXHRcdFx0aW5zZXJ0Tm9kZShwYXJlbnRFbGVtZW50LCBub2RlLCBpbmRleClcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUaGUgY29uZmlncyBhcmUgY2FsbGVkIGFmdGVyIGBidWlsZGAgZmluaXNoZXMgcnVubmluZ1xyXG5cdFx0c2NoZWR1bGVDb25maWdzVG9CZUNhbGxlZChjb25maWdzLCBkYXRhLCBub2RlLCBpc05ldywgY2FjaGVkKVxyXG5cclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkKFxyXG5cdFx0cGFyZW50RWxlbWVudCxcclxuXHRcdHBhcmVudFRhZyxcclxuXHRcdHBhcmVudENhY2hlLFxyXG5cdFx0cGFyZW50SW5kZXgsXHJcblx0XHRkYXRhLFxyXG5cdFx0Y2FjaGVkLFxyXG5cdFx0c2hvdWxkUmVhdHRhY2gsXHJcblx0XHRpbmRleCxcclxuXHRcdGVkaXRhYmxlLFxyXG5cdFx0bmFtZXNwYWNlLFxyXG5cdFx0Y29uZmlnc1xyXG5cdCkge1xyXG5cdFx0LypcclxuXHRcdCAqIGBidWlsZGAgaXMgYSByZWN1cnNpdmUgZnVuY3Rpb24gdGhhdCBtYW5hZ2VzIGNyZWF0aW9uL2RpZmZpbmcvcmVtb3ZhbFxyXG5cdFx0ICogb2YgRE9NIGVsZW1lbnRzIGJhc2VkIG9uIGNvbXBhcmlzb24gYmV0d2VlbiBgZGF0YWAgYW5kIGBjYWNoZWRgIHRoZVxyXG5cdFx0ICogZGlmZiBhbGdvcml0aG0gY2FuIGJlIHN1bW1hcml6ZWQgYXMgdGhpczpcclxuXHRcdCAqXHJcblx0XHQgKiAxIC0gY29tcGFyZSBgZGF0YWAgYW5kIGBjYWNoZWRgXHJcblx0XHQgKiAyIC0gaWYgdGhleSBhcmUgZGlmZmVyZW50LCBjb3B5IGBkYXRhYCB0byBgY2FjaGVkYCBhbmQgdXBkYXRlIHRoZSBET01cclxuXHRcdCAqICAgICBiYXNlZCBvbiB3aGF0IHRoZSBkaWZmZXJlbmNlIGlzXHJcblx0XHQgKiAzIC0gcmVjdXJzaXZlbHkgYXBwbHkgdGhpcyBhbGdvcml0aG0gZm9yIGV2ZXJ5IGFycmF5IGFuZCBmb3IgdGhlXHJcblx0XHQgKiAgICAgY2hpbGRyZW4gb2YgZXZlcnkgdmlydHVhbCBlbGVtZW50XHJcblx0XHQgKlxyXG5cdFx0ICogVGhlIGBjYWNoZWRgIGRhdGEgc3RydWN0dXJlIGlzIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBwcmV2aW91c1xyXG5cdFx0ICogcmVkcmF3J3MgYGRhdGFgIGRhdGEgc3RydWN0dXJlLCB3aXRoIGEgZmV3IGFkZGl0aW9uczpcclxuXHRcdCAqIC0gYGNhY2hlZGAgYWx3YXlzIGhhcyBhIHByb3BlcnR5IGNhbGxlZCBgbm9kZXNgLCB3aGljaCBpcyBhIGxpc3Qgb2ZcclxuXHRcdCAqICAgIERPTSBlbGVtZW50cyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIGRhdGEgcmVwcmVzZW50ZWQgYnkgdGhlXHJcblx0XHQgKiAgICByZXNwZWN0aXZlIHZpcnR1YWwgZWxlbWVudFxyXG5cdFx0ICogLSBpbiBvcmRlciB0byBzdXBwb3J0IGF0dGFjaGluZyBgbm9kZXNgIGFzIGEgcHJvcGVydHkgb2YgYGNhY2hlZGAsXHJcblx0XHQgKiAgICBgY2FjaGVkYCBpcyAqYWx3YXlzKiBhIG5vbi1wcmltaXRpdmUgb2JqZWN0LCBpLmUuIGlmIHRoZSBkYXRhIHdhc1xyXG5cdFx0ICogICAgYSBzdHJpbmcsIHRoZW4gY2FjaGVkIGlzIGEgU3RyaW5nIGluc3RhbmNlLiBJZiBkYXRhIHdhcyBgbnVsbGAgb3JcclxuXHRcdCAqICAgIGB1bmRlZmluZWRgLCBjYWNoZWQgaXMgYG5ldyBTdHJpbmcoXCJcIilgXHJcblx0XHQgKiAtIGBjYWNoZWQgYWxzbyBoYXMgYSBgY29uZmlnQ29udGV4dGAgcHJvcGVydHksIHdoaWNoIGlzIHRoZSBzdGF0ZVxyXG5cdFx0ICogICAgc3RvcmFnZSBvYmplY3QgZXhwb3NlZCBieSBjb25maWcoZWxlbWVudCwgaXNJbml0aWFsaXplZCwgY29udGV4dClcclxuXHRcdCAqIC0gd2hlbiBgY2FjaGVkYCBpcyBhbiBPYmplY3QsIGl0IHJlcHJlc2VudHMgYSB2aXJ0dWFsIGVsZW1lbnQ7IHdoZW5cclxuXHRcdCAqICAgIGl0J3MgYW4gQXJyYXksIGl0IHJlcHJlc2VudHMgYSBsaXN0IG9mIGVsZW1lbnRzOyB3aGVuIGl0J3MgYVxyXG5cdFx0ICogICAgU3RyaW5nLCBOdW1iZXIgb3IgQm9vbGVhbiwgaXQgcmVwcmVzZW50cyBhIHRleHQgbm9kZVxyXG5cdFx0ICpcclxuXHRcdCAqIGBwYXJlbnRFbGVtZW50YCBpcyBhIERPTSBlbGVtZW50IHVzZWQgZm9yIFczQyBET00gQVBJIGNhbGxzXHJcblx0XHQgKiBgcGFyZW50VGFnYCBpcyBvbmx5IHVzZWQgZm9yIGhhbmRsaW5nIGEgY29ybmVyIGNhc2UgZm9yIHRleHRhcmVhXHJcblx0XHQgKiB2YWx1ZXNcclxuXHRcdCAqIGBwYXJlbnRDYWNoZWAgaXMgdXNlZCB0byByZW1vdmUgbm9kZXMgaW4gc29tZSBtdWx0aS1ub2RlIGNhc2VzXHJcblx0XHQgKiBgcGFyZW50SW5kZXhgIGFuZCBgaW5kZXhgIGFyZSB1c2VkIHRvIGZpZ3VyZSBvdXQgdGhlIG9mZnNldCBvZiBub2Rlcy5cclxuXHRcdCAqIFRoZXkncmUgYXJ0aWZhY3RzIGZyb20gYmVmb3JlIGFycmF5cyBzdGFydGVkIGJlaW5nIGZsYXR0ZW5lZCBhbmQgYXJlXHJcblx0XHQgKiBsaWtlbHkgcmVmYWN0b3JhYmxlXHJcblx0XHQgKiBgZGF0YWAgYW5kIGBjYWNoZWRgIGFyZSwgcmVzcGVjdGl2ZWx5LCB0aGUgbmV3IGFuZCBvbGQgbm9kZXMgYmVpbmdcclxuXHRcdCAqIGRpZmZlZFxyXG5cdFx0ICogYHNob3VsZFJlYXR0YWNoYCBpcyBhIGZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIGEgcGFyZW50IG5vZGUgd2FzXHJcblx0XHQgKiByZWNyZWF0ZWQgKGlmIHNvLCBhbmQgaWYgdGhpcyBub2RlIGlzIHJldXNlZCwgdGhlbiB0aGlzIG5vZGUgbXVzdFxyXG5cdFx0ICogcmVhdHRhY2ggaXRzZWxmIHRvIHRoZSBuZXcgcGFyZW50KVxyXG5cdFx0ICogYGVkaXRhYmxlYCBpcyBhIGZsYWcgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciBhbiBhbmNlc3RvciBpc1xyXG5cdFx0ICogY29udGVudGVkaXRhYmxlXHJcblx0XHQgKiBgbmFtZXNwYWNlYCBpbmRpY2F0ZXMgdGhlIGNsb3Nlc3QgSFRNTCBuYW1lc3BhY2UgYXMgaXQgY2FzY2FkZXMgZG93blxyXG5cdFx0ICogZnJvbSBhbiBhbmNlc3RvclxyXG5cdFx0ICogYGNvbmZpZ3NgIGlzIGEgbGlzdCBvZiBjb25maWcgZnVuY3Rpb25zIHRvIHJ1biBhZnRlciB0aGUgdG9wbW9zdFxyXG5cdFx0ICogYGJ1aWxkYCBjYWxsIGZpbmlzaGVzIHJ1bm5pbmdcclxuXHRcdCAqXHJcblx0XHQgKiB0aGVyZSdzIGxvZ2ljIHRoYXQgcmVsaWVzIG9uIHRoZSBhc3N1bXB0aW9uIHRoYXQgbnVsbCBhbmQgdW5kZWZpbmVkXHJcblx0XHQgKiBkYXRhIGFyZSBlcXVpdmFsZW50IHRvIGVtcHR5IHN0cmluZ3NcclxuXHRcdCAqIC0gdGhpcyBwcmV2ZW50cyBsaWZlY3ljbGUgc3VycHJpc2VzIGZyb20gcHJvY2VkdXJhbCBoZWxwZXJzIHRoYXQgbWl4XHJcblx0XHQgKiAgIGltcGxpY2l0IGFuZCBleHBsaWNpdCByZXR1cm4gc3RhdGVtZW50cyAoZS5nLlxyXG5cdFx0ICogICBmdW5jdGlvbiBmb28oKSB7aWYgKGNvbmQpIHJldHVybiBtKFwiZGl2XCIpfVxyXG5cdFx0ICogLSBpdCBzaW1wbGlmaWVzIGRpZmZpbmcgY29kZVxyXG5cdFx0ICovXHJcblx0XHRkYXRhID0gZGF0YVRvU3RyaW5nKGRhdGEpXHJcblx0XHRpZiAoZGF0YS5zdWJ0cmVlID09PSBcInJldGFpblwiKSByZXR1cm4gY2FjaGVkXHJcblx0XHRjYWNoZWQgPSBtYWtlQ2FjaGUoZGF0YSwgY2FjaGVkLCBpbmRleCwgcGFyZW50SW5kZXgsIHBhcmVudENhY2hlKVxyXG5cclxuXHRcdGlmIChpc0FycmF5KGRhdGEpKSB7XHJcblx0XHRcdHJldHVybiBidWlsZEFycmF5KFxyXG5cdFx0XHRcdGRhdGEsXHJcblx0XHRcdFx0Y2FjaGVkLFxyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQsXHJcblx0XHRcdFx0aW5kZXgsXHJcblx0XHRcdFx0cGFyZW50VGFnLFxyXG5cdFx0XHRcdHNob3VsZFJlYXR0YWNoLFxyXG5cdFx0XHRcdGVkaXRhYmxlLFxyXG5cdFx0XHRcdG5hbWVzcGFjZSxcclxuXHRcdFx0XHRjb25maWdzKVxyXG5cdFx0fSBlbHNlIGlmIChkYXRhICE9IG51bGwgJiYgaXNPYmplY3QoZGF0YSkpIHtcclxuXHRcdFx0cmV0dXJuIGJ1aWxkT2JqZWN0KFxyXG5cdFx0XHRcdGRhdGEsXHJcblx0XHRcdFx0Y2FjaGVkLFxyXG5cdFx0XHRcdGVkaXRhYmxlLFxyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQsXHJcblx0XHRcdFx0aW5kZXgsXHJcblx0XHRcdFx0c2hvdWxkUmVhdHRhY2gsXHJcblx0XHRcdFx0bmFtZXNwYWNlLFxyXG5cdFx0XHRcdGNvbmZpZ3MpXHJcblx0XHR9IGVsc2UgaWYgKCFpc0Z1bmN0aW9uKGRhdGEpKSB7XHJcblx0XHRcdHJldHVybiBoYW5kbGVUZXh0Tm9kZShcclxuXHRcdFx0XHRjYWNoZWQsXHJcblx0XHRcdFx0ZGF0YSxcclxuXHRcdFx0XHRpbmRleCxcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50LFxyXG5cdFx0XHRcdHNob3VsZFJlYXR0YWNoLFxyXG5cdFx0XHRcdGVkaXRhYmxlLFxyXG5cdFx0XHRcdHBhcmVudFRhZylcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBjYWNoZWRcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNvcnRDaGFuZ2VzKGEsIGIpIHtcclxuXHRcdHJldHVybiBhLmFjdGlvbiAtIGIuYWN0aW9uIHx8IGEuaW5kZXggLSBiLmluZGV4XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjb3B5U3R5bGVBdHRycyhub2RlLCBkYXRhQXR0ciwgY2FjaGVkQXR0cikge1xyXG5cdFx0Zm9yICh2YXIgcnVsZSBpbiBkYXRhQXR0cikge1xyXG5cdFx0XHRpZiAoaGFzT3duLmNhbGwoZGF0YUF0dHIsIHJ1bGUpKSB7XHJcblx0XHRcdFx0aWYgKGNhY2hlZEF0dHIgPT0gbnVsbCB8fCBjYWNoZWRBdHRyW3J1bGVdICE9PSBkYXRhQXR0cltydWxlXSkge1xyXG5cdFx0XHRcdFx0bm9kZS5zdHlsZVtydWxlXSA9IGRhdGFBdHRyW3J1bGVdXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChydWxlIGluIGNhY2hlZEF0dHIpIHtcclxuXHRcdFx0aWYgKGhhc093bi5jYWxsKGNhY2hlZEF0dHIsIHJ1bGUpKSB7XHJcblx0XHRcdFx0aWYgKCFoYXNPd24uY2FsbChkYXRhQXR0ciwgcnVsZSkpIG5vZGUuc3R5bGVbcnVsZV0gPSBcIlwiXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBzaG91bGRVc2VTZXRBdHRyaWJ1dGUgPSB7XHJcblx0XHRsaXN0OiAxLFxyXG5cdFx0c3R5bGU6IDEsXHJcblx0XHRmb3JtOiAxLFxyXG5cdFx0dHlwZTogMSxcclxuXHRcdHdpZHRoOiAxLFxyXG5cdFx0aGVpZ2h0OiAxXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTaW5nbGVBdHRyKFxyXG5cdFx0bm9kZSxcclxuXHRcdGF0dHJOYW1lLFxyXG5cdFx0ZGF0YUF0dHIsXHJcblx0XHRjYWNoZWRBdHRyLFxyXG5cdFx0dGFnLFxyXG5cdFx0bmFtZXNwYWNlXHJcblx0KSB7XHJcblx0XHRpZiAoYXR0ck5hbWUgPT09IFwiY29uZmlnXCIgfHwgYXR0ck5hbWUgPT09IFwia2V5XCIpIHtcclxuXHRcdFx0Ly8gYGNvbmZpZ2AgaXNuJ3QgYSByZWFsIGF0dHJpYnV0ZSwgc28gaWdub3JlIGl0XHJcblx0XHRcdHJldHVybiB0cnVlXHJcblx0XHR9IGVsc2UgaWYgKGlzRnVuY3Rpb24oZGF0YUF0dHIpICYmIGF0dHJOYW1lLnNsaWNlKDAsIDIpID09PSBcIm9uXCIpIHtcclxuXHRcdFx0Ly8gaG9vayBldmVudCBoYW5kbGVycyB0byB0aGUgYXV0by1yZWRyYXdpbmcgc3lzdGVtXHJcblx0XHRcdG5vZGVbYXR0ck5hbWVdID0gYXV0b3JlZHJhdyhkYXRhQXR0ciwgbm9kZSlcclxuXHRcdH0gZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwic3R5bGVcIiAmJiBkYXRhQXR0ciAhPSBudWxsICYmXHJcblx0XHRcdFx0aXNPYmplY3QoZGF0YUF0dHIpKSB7XHJcblx0XHRcdC8vIGhhbmRsZSBgc3R5bGU6IHsuLi59YFxyXG5cdFx0XHRjb3B5U3R5bGVBdHRycyhub2RlLCBkYXRhQXR0ciwgY2FjaGVkQXR0cilcclxuXHRcdH0gZWxzZSBpZiAobmFtZXNwYWNlICE9IG51bGwpIHtcclxuXHRcdFx0Ly8gaGFuZGxlIFNWR1xyXG5cdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwiaHJlZlwiKSB7XHJcblx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixcclxuXHRcdFx0XHRcdFwiaHJlZlwiLCBkYXRhQXR0cilcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZShcclxuXHRcdFx0XHRcdGF0dHJOYW1lID09PSBcImNsYXNzTmFtZVwiID8gXCJjbGFzc1wiIDogYXR0ck5hbWUsXHJcblx0XHRcdFx0XHRkYXRhQXR0cilcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmIChhdHRyTmFtZSBpbiBub2RlICYmICFzaG91bGRVc2VTZXRBdHRyaWJ1dGVbYXR0ck5hbWVdKSB7XHJcblx0XHRcdC8vIGhhbmRsZSBjYXNlcyB0aGF0IGFyZSBwcm9wZXJ0aWVzIChidXQgaWdub3JlIGNhc2VzIHdoZXJlIHdlXHJcblx0XHRcdC8vIHNob3VsZCB1c2Ugc2V0QXR0cmlidXRlIGluc3RlYWQpXHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIC0gbGlzdCBhbmQgZm9ybSBhcmUgdHlwaWNhbGx5IHVzZWQgYXMgc3RyaW5ncywgYnV0IGFyZSBET01cclxuXHRcdFx0Ly8gICBlbGVtZW50IHJlZmVyZW5jZXMgaW4ganNcclxuXHRcdFx0Ly9cclxuXHRcdFx0Ly8gLSB3aGVuIHVzaW5nIENTUyBzZWxlY3RvcnMgKGUuZy4gYG0oXCJbc3R5bGU9JyddXCIpYCksIHN0eWxlIGlzXHJcblx0XHRcdC8vICAgdXNlZCBhcyBhIHN0cmluZywgYnV0IGl0J3MgYW4gb2JqZWN0IGluIGpzXHJcblx0XHRcdC8vXHJcblx0XHRcdC8vICMzNDggZG9uJ3Qgc2V0IHRoZSB2YWx1ZSBpZiBub3QgbmVlZGVkIC0gb3RoZXJ3aXNlLCBjdXJzb3JcclxuXHRcdFx0Ly8gcGxhY2VtZW50IGJyZWFrcyBpbiBDaHJvbWVcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRpZiAodGFnICE9PSBcImlucHV0XCIgfHwgbm9kZVthdHRyTmFtZV0gIT09IGRhdGFBdHRyKSB7XHJcblx0XHRcdFx0XHRub2RlW2F0dHJOYW1lXSA9IGRhdGFBdHRyXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGRhdGFBdHRyKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBkYXRhQXR0cilcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHRyeVNldEF0dHIoXHJcblx0XHRub2RlLFxyXG5cdFx0YXR0ck5hbWUsXHJcblx0XHRkYXRhQXR0cixcclxuXHRcdGNhY2hlZEF0dHIsXHJcblx0XHRjYWNoZWRBdHRycyxcclxuXHRcdHRhZyxcclxuXHRcdG5hbWVzcGFjZVxyXG5cdCkge1xyXG5cdFx0aWYgKCEoYXR0ck5hbWUgaW4gY2FjaGVkQXR0cnMpIHx8IChjYWNoZWRBdHRyICE9PSBkYXRhQXR0cikpIHtcclxuXHRcdFx0Y2FjaGVkQXR0cnNbYXR0ck5hbWVdID0gZGF0YUF0dHJcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRyZXR1cm4gc2V0U2luZ2xlQXR0cihcclxuXHRcdFx0XHRcdG5vZGUsXHJcblx0XHRcdFx0XHRhdHRyTmFtZSxcclxuXHRcdFx0XHRcdGRhdGFBdHRyLFxyXG5cdFx0XHRcdFx0Y2FjaGVkQXR0cixcclxuXHRcdFx0XHRcdHRhZyxcclxuXHRcdFx0XHRcdG5hbWVzcGFjZSlcclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdC8vIHN3YWxsb3cgSUUncyBpbnZhbGlkIGFyZ3VtZW50IGVycm9ycyB0byBtaW1pYyBIVE1MJ3NcclxuXHRcdFx0XHQvLyBmYWxsYmFjay10by1kb2luZy1ub3RoaW5nLW9uLWludmFsaWQtYXR0cmlidXRlcyBiZWhhdmlvclxyXG5cdFx0XHRcdGlmIChlLm1lc3NhZ2UuaW5kZXhPZihcIkludmFsaWQgYXJndW1lbnRcIikgPCAwKSB0aHJvdyBlXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwidmFsdWVcIiAmJiB0YWcgPT09IFwiaW5wdXRcIiAmJlxyXG5cdFx0XHRcdG5vZGUudmFsdWUgIT09IGRhdGFBdHRyKSB7XHJcblx0XHRcdC8vICMzNDggZGF0YUF0dHIgbWF5IG5vdCBiZSBhIHN0cmluZywgc28gdXNlIGxvb3NlIGNvbXBhcmlzb25cclxuXHRcdFx0bm9kZS52YWx1ZSA9IGRhdGFBdHRyXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRBdHRyaWJ1dGVzKG5vZGUsIHRhZywgZGF0YUF0dHJzLCBjYWNoZWRBdHRycywgbmFtZXNwYWNlKSB7XHJcblx0XHRmb3IgKHZhciBhdHRyTmFtZSBpbiBkYXRhQXR0cnMpIHtcclxuXHRcdFx0aWYgKGhhc093bi5jYWxsKGRhdGFBdHRycywgYXR0ck5hbWUpKSB7XHJcblx0XHRcdFx0aWYgKHRyeVNldEF0dHIoXHJcblx0XHRcdFx0XHRcdG5vZGUsXHJcblx0XHRcdFx0XHRcdGF0dHJOYW1lLFxyXG5cdFx0XHRcdFx0XHRkYXRhQXR0cnNbYXR0ck5hbWVdLFxyXG5cdFx0XHRcdFx0XHRjYWNoZWRBdHRyc1thdHRyTmFtZV0sXHJcblx0XHRcdFx0XHRcdGNhY2hlZEF0dHJzLFxyXG5cdFx0XHRcdFx0XHR0YWcsXHJcblx0XHRcdFx0XHRcdG5hbWVzcGFjZSkpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2FjaGVkQXR0cnNcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNsZWFyKG5vZGVzLCBjYWNoZWQpIHtcclxuXHRcdGZvciAodmFyIGkgPSBub2Rlcy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xyXG5cdFx0XHRpZiAobm9kZXNbaV0gJiYgbm9kZXNbaV0ucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRub2Rlc1tpXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGVzW2ldKVxyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cclxuXHRcdFx0XHRcdC8vIGlnbm9yZSBpZiB0aGlzIGZhaWxzIGR1ZSB0byBvcmRlciBvZiBldmVudHMgKHNlZVxyXG5cdFx0XHRcdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMTkyNjA4My9mYWlsZWQtdG8tZXhlY3V0ZS1yZW1vdmVjaGlsZC1vbi1ub2RlKVxyXG5cdFx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBtYXgtbGVuICovXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhY2hlZCA9IFtdLmNvbmNhdChjYWNoZWQpXHJcblx0XHRcdFx0aWYgKGNhY2hlZFtpXSkgdW5sb2FkKGNhY2hlZFtpXSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gcmVsZWFzZSBtZW1vcnkgaWYgbm9kZXMgaXMgYW4gYXJyYXkuIFRoaXMgY2hlY2sgc2hvdWxkIGZhaWwgaWYgbm9kZXNcclxuXHRcdC8vIGlzIGEgTm9kZUxpc3QgKHNlZSBsb29wIGFib3ZlKVxyXG5cdFx0aWYgKG5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHRub2Rlcy5sZW5ndGggPSAwXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB1bmxvYWQoY2FjaGVkKSB7XHJcblx0XHRpZiAoY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgaXNGdW5jdGlvbihjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCkpIHtcclxuXHRcdFx0Y2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQoKVxyXG5cdFx0XHRjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9IG51bGxcclxuXHRcdH1cclxuXHRcdGlmIChjYWNoZWQuY29udHJvbGxlcnMpIHtcclxuXHRcdFx0Zm9yRWFjaChjYWNoZWQuY29udHJvbGxlcnMsIGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XHJcblx0XHRcdFx0aWYgKGlzRnVuY3Rpb24oY29udHJvbGxlci5vbnVubG9hZCkpIHtcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0XHRpZiAoY2FjaGVkLmNoaWxkcmVuKSB7XHJcblx0XHRcdGlmIChpc0FycmF5KGNhY2hlZC5jaGlsZHJlbikpIGZvckVhY2goY2FjaGVkLmNoaWxkcmVuLCB1bmxvYWQpXHJcblx0XHRcdGVsc2UgaWYgKGNhY2hlZC5jaGlsZHJlbi50YWcpIHVubG9hZChjYWNoZWQuY2hpbGRyZW4pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhcHBlbmRUZXh0RnJhZ21lbnQocGFyZW50RWxlbWVudCwgZGF0YSkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0cGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChcclxuXHRcdFx0XHQkZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoZGF0YSkpXHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIGRhdGEpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBpbmplY3RIVE1MKHBhcmVudEVsZW1lbnQsIGluZGV4LCBkYXRhKSB7XHJcblx0XHR2YXIgbmV4dFNpYmxpbmcgPSBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdXHJcblx0XHRpZiAobmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0dmFyIGlzRWxlbWVudCA9IG5leHRTaWJsaW5nLm5vZGVUeXBlICE9PSAxXHJcblx0XHRcdHZhciBwbGFjZWhvbGRlciA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKVxyXG5cdFx0XHRpZiAoaXNFbGVtZW50KSB7XHJcblx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUocGxhY2Vob2xkZXIsIG5leHRTaWJsaW5nIHx8IG51bGwpXHJcblx0XHRcdFx0cGxhY2Vob2xkZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlYmVnaW5cIiwgZGF0YSlcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHBsYWNlaG9sZGVyKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5leHRTaWJsaW5nLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWJlZ2luXCIsIGRhdGEpXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFwcGVuZFRleHRGcmFnbWVudChwYXJlbnRFbGVtZW50LCBkYXRhKVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBub2RlcyA9IFtdXHJcblxyXG5cdFx0d2hpbGUgKHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gIT09IG5leHRTaWJsaW5nKSB7XHJcblx0XHRcdG5vZGVzLnB1c2gocGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSlcclxuXHRcdFx0aW5kZXgrK1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBub2Rlc1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYXV0b3JlZHJhdyhjYWxsYmFjaywgb2JqZWN0KSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZSA9IGUgfHwgZXZlbnRcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpXHJcblx0XHRcdG0uc3RhcnRDb21wdXRhdGlvbigpXHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwob2JqZWN0LCBlKVxyXG5cdFx0XHR9IGZpbmFsbHkge1xyXG5cdFx0XHRcdGVuZEZpcnN0Q29tcHV0YXRpb24oKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgaHRtbFxyXG5cdHZhciBkb2N1bWVudE5vZGUgPSB7XHJcblx0XHRhcHBlbmRDaGlsZDogZnVuY3Rpb24gKG5vZGUpIHtcclxuXHRcdFx0aWYgKGh0bWwgPT09IHVuZGVmaW5lZCkgaHRtbCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHRtbFwiKVxyXG5cdFx0XHRpZiAoJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJlxyXG5cdFx0XHRcdFx0JGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAhPT0gbm9kZSkge1xyXG5cdFx0XHRcdCRkb2N1bWVudC5yZXBsYWNlQ2hpbGQobm9kZSwgJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudClcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkZG9jdW1lbnQuYXBwZW5kQ2hpbGQobm9kZSlcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5jaGlsZE5vZGVzID0gJGRvY3VtZW50LmNoaWxkTm9kZXNcclxuXHRcdH0sXHJcblxyXG5cdFx0aW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAobm9kZSkge1xyXG5cdFx0XHR0aGlzLmFwcGVuZENoaWxkKG5vZGUpXHJcblx0XHR9LFxyXG5cclxuXHRcdGNoaWxkTm9kZXM6IFtdXHJcblx0fVxyXG5cclxuXHR2YXIgbm9kZUNhY2hlID0gW11cclxuXHR2YXIgY2VsbENhY2hlID0ge31cclxuXHJcblx0bS5yZW5kZXIgPSBmdW5jdGlvbiAocm9vdCwgY2VsbCwgZm9yY2VSZWNyZWF0aW9uKSB7XHJcblx0XHRpZiAoIXJvb3QpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBET00gZWxlbWVudCBiZWluZyBwYXNzZWQgdG8gXCIgK1xyXG5cdFx0XHRcdFwibS5yb3V0ZS9tLm1vdW50L20ucmVuZGVyIGlzIG5vdCB1bmRlZmluZWQuXCIpXHJcblx0XHR9XHJcblx0XHR2YXIgY29uZmlncyA9IFtdXHJcblx0XHR2YXIgaWQgPSBnZXRDZWxsQ2FjaGVLZXkocm9vdClcclxuXHRcdHZhciBpc0RvY3VtZW50Um9vdCA9IHJvb3QgPT09ICRkb2N1bWVudFxyXG5cdFx0dmFyIG5vZGVcclxuXHJcblx0XHRpZiAoaXNEb2N1bWVudFJvb3QgfHwgcm9vdCA9PT0gJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRub2RlID0gZG9jdW1lbnROb2RlXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRub2RlID0gcm9vdFxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpc0RvY3VtZW50Um9vdCAmJiBjZWxsLnRhZyAhPT0gXCJodG1sXCIpIHtcclxuXHRcdFx0Y2VsbCA9IHt0YWc6IFwiaHRtbFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBjZWxsfVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChjZWxsQ2FjaGVbaWRdID09PSB1bmRlZmluZWQpIGNsZWFyKG5vZGUuY2hpbGROb2RlcylcclxuXHRcdGlmIChmb3JjZVJlY3JlYXRpb24gPT09IHRydWUpIHJlc2V0KHJvb3QpXHJcblxyXG5cdFx0Y2VsbENhY2hlW2lkXSA9IGJ1aWxkKFxyXG5cdFx0XHRub2RlLFxyXG5cdFx0XHRudWxsLFxyXG5cdFx0XHR1bmRlZmluZWQsXHJcblx0XHRcdHVuZGVmaW5lZCxcclxuXHRcdFx0Y2VsbCxcclxuXHRcdFx0Y2VsbENhY2hlW2lkXSxcclxuXHRcdFx0ZmFsc2UsXHJcblx0XHRcdDAsXHJcblx0XHRcdG51bGwsXHJcblx0XHRcdHVuZGVmaW5lZCxcclxuXHRcdFx0Y29uZmlncylcclxuXHJcblx0XHRmb3JFYWNoKGNvbmZpZ3MsIGZ1bmN0aW9uIChjb25maWcpIHsgY29uZmlnKCkgfSlcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldENlbGxDYWNoZUtleShlbGVtZW50KSB7XHJcblx0XHR2YXIgaW5kZXggPSBub2RlQ2FjaGUuaW5kZXhPZihlbGVtZW50KVxyXG5cdFx0cmV0dXJuIGluZGV4IDwgMCA/IG5vZGVDYWNoZS5wdXNoKGVsZW1lbnQpIC0gMSA6IGluZGV4XHJcblx0fVxyXG5cclxuXHRtLnRydXN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHR2YWx1ZSA9IG5ldyBTdHJpbmcodmFsdWUpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXHJcblx0XHR2YWx1ZS4kdHJ1c3RlZCA9IHRydWVcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0dGVyc2V0dGVyKHN0b3JlKSB7XHJcblx0XHRmdW5jdGlvbiBwcm9wKCkge1xyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCkgc3RvcmUgPSBhcmd1bWVudHNbMF1cclxuXHRcdFx0cmV0dXJuIHN0b3JlXHJcblx0XHR9XHJcblxyXG5cdFx0cHJvcC50b0pTT04gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiBzdG9yZVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBwcm9wXHJcblx0fVxyXG5cclxuXHRtLnByb3AgPSBmdW5jdGlvbiAoc3RvcmUpIHtcclxuXHRcdGlmICgoc3RvcmUgIT0gbnVsbCAmJiBpc09iamVjdChzdG9yZSkgfHwgaXNGdW5jdGlvbihzdG9yZSkpICYmXHJcblx0XHRcdFx0aXNGdW5jdGlvbihzdG9yZS50aGVuKSkge1xyXG5cdFx0XHRyZXR1cm4gcHJvcGlmeShzdG9yZSlcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZ2V0dGVyc2V0dGVyKHN0b3JlKVxyXG5cdH1cclxuXHJcblx0dmFyIHJvb3RzID0gW11cclxuXHR2YXIgY29tcG9uZW50cyA9IFtdXHJcblx0dmFyIGNvbnRyb2xsZXJzID0gW11cclxuXHR2YXIgbGFzdFJlZHJhd0lkID0gbnVsbFxyXG5cdHZhciBsYXN0UmVkcmF3Q2FsbFRpbWUgPSAwXHJcblx0dmFyIGNvbXB1dGVQcmVSZWRyYXdIb29rID0gbnVsbFxyXG5cdHZhciBjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBudWxsXHJcblx0dmFyIHRvcENvbXBvbmVudFxyXG5cdHZhciBGUkFNRV9CVURHRVQgPSAxNiAvLyA2MCBmcmFtZXMgcGVyIHNlY29uZCA9IDEgY2FsbCBwZXIgMTYgbXNcclxuXHJcblx0ZnVuY3Rpb24gcGFyYW1ldGVyaXplKGNvbXBvbmVudCwgYXJncykge1xyXG5cdFx0ZnVuY3Rpb24gY29udHJvbGxlcigpIHtcclxuXHRcdFx0LyogZXNsaW50LWRpc2FibGUgbm8taW52YWxpZC10aGlzICovXHJcblx0XHRcdHJldHVybiAoY29tcG9uZW50LmNvbnRyb2xsZXIgfHwgbm9vcCkuYXBwbHkodGhpcywgYXJncykgfHwgdGhpc1xyXG5cdFx0XHQvKiBlc2xpbnQtZW5hYmxlIG5vLWludmFsaWQtdGhpcyAqL1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChjb21wb25lbnQuY29udHJvbGxlcikge1xyXG5cdFx0XHRjb250cm9sbGVyLnByb3RvdHlwZSA9IGNvbXBvbmVudC5jb250cm9sbGVyLnByb3RvdHlwZVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHZpZXcoY3RybCkge1xyXG5cdFx0XHR2YXIgY3VycmVudEFyZ3MgPSBbY3RybF0uY29uY2F0KGFyZ3MpXHJcblx0XHRcdGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0Y3VycmVudEFyZ3MucHVzaChhcmd1bWVudHNbaV0pXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBjb21wb25lbnQudmlldy5hcHBseShjb21wb25lbnQsIGN1cnJlbnRBcmdzKVxyXG5cdFx0fVxyXG5cclxuXHRcdHZpZXcuJG9yaWdpbmFsID0gY29tcG9uZW50LnZpZXdcclxuXHRcdHZhciBvdXRwdXQgPSB7Y29udHJvbGxlcjogY29udHJvbGxlciwgdmlldzogdmlld31cclxuXHRcdGlmIChhcmdzWzBdICYmIGFyZ3NbMF0ua2V5ICE9IG51bGwpIG91dHB1dC5hdHRycyA9IHtrZXk6IGFyZ3NbMF0ua2V5fVxyXG5cdFx0cmV0dXJuIG91dHB1dFxyXG5cdH1cclxuXHJcblx0bS5jb21wb25lbnQgPSBmdW5jdGlvbiAoY29tcG9uZW50KSB7XHJcblx0XHR2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSlcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBwYXJhbWV0ZXJpemUoY29tcG9uZW50LCBhcmdzKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2hlY2tQcmV2ZW50ZWQoY29tcG9uZW50LCByb290LCBpbmRleCwgaXNQcmV2ZW50ZWQpIHtcclxuXHRcdGlmICghaXNQcmV2ZW50ZWQpIHtcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJhbGxcIilcclxuXHRcdFx0bS5zdGFydENvbXB1dGF0aW9uKClcclxuXHRcdFx0cm9vdHNbaW5kZXhdID0gcm9vdFxyXG5cdFx0XHR2YXIgY3VycmVudENvbXBvbmVudFxyXG5cclxuXHRcdFx0aWYgKGNvbXBvbmVudCkge1xyXG5cdFx0XHRcdGN1cnJlbnRDb21wb25lbnQgPSB0b3BDb21wb25lbnQgPSBjb21wb25lbnRcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjdXJyZW50Q29tcG9uZW50ID0gdG9wQ29tcG9uZW50ID0gY29tcG9uZW50ID0ge2NvbnRyb2xsZXI6IG5vb3B9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBjb250cm9sbGVyID0gbmV3IChjb21wb25lbnQuY29udHJvbGxlciB8fCBub29wKSgpXHJcblxyXG5cdFx0XHQvLyBjb250cm9sbGVycyBtYXkgY2FsbCBtLm1vdW50IHJlY3Vyc2l2ZWx5ICh2aWEgbS5yb3V0ZSByZWRpcmVjdHMsXHJcblx0XHRcdC8vIGZvciBleGFtcGxlKVxyXG5cdFx0XHQvLyB0aGlzIGNvbmRpdGlvbmFsIGVuc3VyZXMgb25seSB0aGUgbGFzdCByZWN1cnNpdmUgbS5tb3VudCBjYWxsIGlzXHJcblx0XHRcdC8vIGFwcGxpZWRcclxuXHRcdFx0aWYgKGN1cnJlbnRDb21wb25lbnQgPT09IHRvcENvbXBvbmVudCkge1xyXG5cdFx0XHRcdGNvbnRyb2xsZXJzW2luZGV4XSA9IGNvbnRyb2xsZXJcclxuXHRcdFx0XHRjb21wb25lbnRzW2luZGV4XSA9IGNvbXBvbmVudFxyXG5cdFx0XHR9XHJcblx0XHRcdGVuZEZpcnN0Q29tcHV0YXRpb24oKVxyXG5cdFx0XHRpZiAoY29tcG9uZW50ID09PSBudWxsKSB7XHJcblx0XHRcdFx0cmVtb3ZlUm9vdEVsZW1lbnQocm9vdCwgaW5kZXgpXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGNvbnRyb2xsZXJzW2luZGV4XVxyXG5cdFx0fSBlbHNlIGlmIChjb21wb25lbnQgPT0gbnVsbCkge1xyXG5cdFx0XHRyZW1vdmVSb290RWxlbWVudChyb290LCBpbmRleClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG0ubW91bnQgPSBtLm1vZHVsZSA9IGZ1bmN0aW9uIChyb290LCBjb21wb25lbnQpIHtcclxuXHRcdGlmICghcm9vdCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJQbGVhc2UgZW5zdXJlIHRoZSBET00gZWxlbWVudCBleGlzdHMgYmVmb3JlIFwiICtcclxuXHRcdFx0XHRcInJlbmRlcmluZyBhIHRlbXBsYXRlIGludG8gaXQuXCIpXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGluZGV4ID0gcm9vdHMuaW5kZXhPZihyb290KVxyXG5cdFx0aWYgKGluZGV4IDwgMCkgaW5kZXggPSByb290cy5sZW5ndGhcclxuXHJcblx0XHR2YXIgaXNQcmV2ZW50ZWQgPSBmYWxzZVxyXG5cdFx0dmFyIGV2ZW50ID0ge1xyXG5cdFx0XHRwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGlzUHJldmVudGVkID0gdHJ1ZVxyXG5cdFx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gY29tcHV0ZVBvc3RSZWRyYXdIb29rID0gbnVsbFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yRWFjaCh1bmxvYWRlcnMsIGZ1bmN0aW9uICh1bmxvYWRlcikge1xyXG5cdFx0XHR1bmxvYWRlci5oYW5kbGVyLmNhbGwodW5sb2FkZXIuY29udHJvbGxlciwgZXZlbnQpXHJcblx0XHRcdHVubG9hZGVyLmNvbnRyb2xsZXIub251bmxvYWQgPSBudWxsXHJcblx0XHR9KVxyXG5cclxuXHRcdGlmIChpc1ByZXZlbnRlZCkge1xyXG5cdFx0XHRmb3JFYWNoKHVubG9hZGVycywgZnVuY3Rpb24gKHVubG9hZGVyKSB7XHJcblx0XHRcdFx0dW5sb2FkZXIuY29udHJvbGxlci5vbnVubG9hZCA9IHVubG9hZGVyLmhhbmRsZXJcclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHVubG9hZGVycyA9IFtdXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNvbnRyb2xsZXJzW2luZGV4XSAmJiBpc0Z1bmN0aW9uKGNvbnRyb2xsZXJzW2luZGV4XS5vbnVubG9hZCkpIHtcclxuXHRcdFx0Y29udHJvbGxlcnNbaW5kZXhdLm9udW5sb2FkKGV2ZW50KVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjaGVja1ByZXZlbnRlZChjb21wb25lbnQsIHJvb3QsIGluZGV4LCBpc1ByZXZlbnRlZClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHJlbW92ZVJvb3RFbGVtZW50KHJvb3QsIGluZGV4KSB7XHJcblx0XHRyb290cy5zcGxpY2UoaW5kZXgsIDEpXHJcblx0XHRjb250cm9sbGVycy5zcGxpY2UoaW5kZXgsIDEpXHJcblx0XHRjb21wb25lbnRzLnNwbGljZShpbmRleCwgMSlcclxuXHRcdHJlc2V0KHJvb3QpXHJcblx0XHRub2RlQ2FjaGUuc3BsaWNlKGdldENlbGxDYWNoZUtleShyb290KSwgMSlcclxuXHR9XHJcblxyXG5cdHZhciByZWRyYXdpbmcgPSBmYWxzZVxyXG5cdG0ucmVkcmF3ID0gZnVuY3Rpb24gKGZvcmNlKSB7XHJcblx0XHRpZiAocmVkcmF3aW5nKSByZXR1cm5cclxuXHRcdHJlZHJhd2luZyA9IHRydWVcclxuXHRcdGlmIChmb3JjZSkgZm9yY2luZyA9IHRydWVcclxuXHJcblx0XHR0cnkge1xyXG5cdFx0XHQvLyBsYXN0UmVkcmF3SWQgaXMgYSBwb3NpdGl2ZSBudW1iZXIgaWYgYSBzZWNvbmQgcmVkcmF3IGlzIHJlcXVlc3RlZFxyXG5cdFx0XHQvLyBiZWZvcmUgdGhlIG5leHQgYW5pbWF0aW9uIGZyYW1lXHJcblx0XHRcdC8vIGxhc3RSZWRyYXdJZCBpcyBudWxsIGlmIGl0J3MgdGhlIGZpcnN0IHJlZHJhdyBhbmQgbm90IGFuIGV2ZW50XHJcblx0XHRcdC8vIGhhbmRsZXJcclxuXHRcdFx0aWYgKGxhc3RSZWRyYXdJZCAmJiAhZm9yY2UpIHtcclxuXHRcdFx0XHQvLyB3aGVuIHNldFRpbWVvdXQ6IG9ubHkgcmVzY2hlZHVsZSByZWRyYXcgaWYgdGltZSBiZXR3ZWVuIG5vd1xyXG5cdFx0XHRcdC8vIGFuZCBwcmV2aW91cyByZWRyYXcgaXMgYmlnZ2VyIHRoYW4gYSBmcmFtZSwgb3RoZXJ3aXNlIGtlZXBcclxuXHRcdFx0XHQvLyBjdXJyZW50bHkgc2NoZWR1bGVkIHRpbWVvdXRcclxuXHRcdFx0XHQvLyB3aGVuIHJBRjogYWx3YXlzIHJlc2NoZWR1bGUgcmVkcmF3XHJcblx0XHRcdFx0aWYgKCRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09IGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdFx0XHRcdFx0bmV3IERhdGUoKSAtIGxhc3RSZWRyYXdDYWxsVGltZSA+IEZSQU1FX0JVREdFVCkge1xyXG5cdFx0XHRcdFx0aWYgKGxhc3RSZWRyYXdJZCA+IDApICRjYW5jZWxBbmltYXRpb25GcmFtZShsYXN0UmVkcmF3SWQpXHJcblx0XHRcdFx0XHRsYXN0UmVkcmF3SWQgPSAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZHJhdywgRlJBTUVfQlVER0VUKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZWRyYXcoKVxyXG5cdFx0XHRcdGxhc3RSZWRyYXdJZCA9ICRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0bGFzdFJlZHJhd0lkID0gbnVsbFxyXG5cdFx0XHRcdH0sIEZSQU1FX0JVREdFVClcclxuXHRcdFx0fVxyXG5cdFx0fSBmaW5hbGx5IHtcclxuXHRcdFx0cmVkcmF3aW5nID0gZm9yY2luZyA9IGZhbHNlXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtLnJlZHJhdy5zdHJhdGVneSA9IG0ucHJvcCgpXHJcblx0ZnVuY3Rpb24gcmVkcmF3KCkge1xyXG5cdFx0aWYgKGNvbXB1dGVQcmVSZWRyYXdIb29rKSB7XHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rKClcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBudWxsXHJcblx0XHR9XHJcblx0XHRmb3JFYWNoKHJvb3RzLCBmdW5jdGlvbiAocm9vdCwgaSkge1xyXG5cdFx0XHR2YXIgY29tcG9uZW50ID0gY29tcG9uZW50c1tpXVxyXG5cdFx0XHRpZiAoY29udHJvbGxlcnNbaV0pIHtcclxuXHRcdFx0XHR2YXIgYXJncyA9IFtjb250cm9sbGVyc1tpXV1cclxuXHRcdFx0XHRtLnJlbmRlcihyb290LFxyXG5cdFx0XHRcdFx0Y29tcG9uZW50LnZpZXcgPyBjb21wb25lbnQudmlldyhjb250cm9sbGVyc1tpXSwgYXJncykgOiBcIlwiKVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0Ly8gYWZ0ZXIgcmVuZGVyaW5nIHdpdGhpbiBhIHJvdXRlZCBjb250ZXh0LCB3ZSBuZWVkIHRvIHNjcm9sbCBiYWNrIHRvXHJcblx0XHQvLyB0aGUgdG9wLCBhbmQgZmV0Y2ggdGhlIGRvY3VtZW50IHRpdGxlIGZvciBoaXN0b3J5LnB1c2hTdGF0ZVxyXG5cdFx0aWYgKGNvbXB1dGVQb3N0UmVkcmF3SG9vaykge1xyXG5cdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2soKVxyXG5cdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBudWxsXHJcblx0XHR9XHJcblx0XHRsYXN0UmVkcmF3SWQgPSBudWxsXHJcblx0XHRsYXN0UmVkcmF3Q2FsbFRpbWUgPSBuZXcgRGF0ZSgpXHJcblx0XHRtLnJlZHJhdy5zdHJhdGVneShcImRpZmZcIilcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGVuZEZpcnN0Q29tcHV0YXRpb24oKSB7XHJcblx0XHRpZiAobS5yZWRyYXcuc3RyYXRlZ3koKSA9PT0gXCJub25lXCIpIHtcclxuXHRcdFx0cGVuZGluZ1JlcXVlc3RzLS1cclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRtLmVuZENvbXB1dGF0aW9uKClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG0ud2l0aEF0dHIgPSBmdW5jdGlvbiAocHJvcCwgd2l0aEF0dHJDYWxsYmFjaywgY2FsbGJhY2tUaGlzKSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZSA9IGUgfHwgd2luZG93LmV2ZW50XHJcblx0XHRcdC8qIGVzbGludC1kaXNhYmxlIG5vLWludmFsaWQtdGhpcyAqL1xyXG5cdFx0XHR2YXIgY3VycmVudFRhcmdldCA9IGUuY3VycmVudFRhcmdldCB8fCB0aGlzXHJcblx0XHRcdHZhciBfdGhpcyA9IGNhbGxiYWNrVGhpcyB8fCB0aGlzXHJcblx0XHRcdC8qIGVzbGludC1lbmFibGUgbm8taW52YWxpZC10aGlzICovXHJcblx0XHRcdHZhciB0YXJnZXQgPSBwcm9wIGluIGN1cnJlbnRUYXJnZXQgP1xyXG5cdFx0XHRcdGN1cnJlbnRUYXJnZXRbcHJvcF0gOlxyXG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKHByb3ApXHJcblx0XHRcdHdpdGhBdHRyQ2FsbGJhY2suY2FsbChfdGhpcywgdGFyZ2V0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gcm91dGluZ1xyXG5cdHZhciBtb2RlcyA9IHtwYXRobmFtZTogXCJcIiwgaGFzaDogXCIjXCIsIHNlYXJjaDogXCI/XCJ9XHJcblx0dmFyIHJlZGlyZWN0ID0gbm9vcFxyXG5cdHZhciBpc0RlZmF1bHRSb3V0ZSA9IGZhbHNlXHJcblx0dmFyIHJvdXRlUGFyYW1zLCBjdXJyZW50Um91dGVcclxuXHJcblx0bS5yb3V0ZSA9IGZ1bmN0aW9uIChyb290LCBhcmcxLCBhcmcyLCB2ZG9tKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuXHRcdC8vIG0ucm91dGUoKVxyXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiBjdXJyZW50Um91dGVcclxuXHRcdC8vIG0ucm91dGUoZWwsIGRlZmF1bHRSb3V0ZSwgcm91dGVzKVxyXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgaXNTdHJpbmcoYXJnMSkpIHtcclxuXHRcdFx0cmVkaXJlY3QgPSBmdW5jdGlvbiAoc291cmNlKSB7XHJcblx0XHRcdFx0dmFyIHBhdGggPSBjdXJyZW50Um91dGUgPSBub3JtYWxpemVSb3V0ZShzb3VyY2UpXHJcblx0XHRcdFx0aWYgKCFyb3V0ZUJ5VmFsdWUocm9vdCwgYXJnMiwgcGF0aCkpIHtcclxuXHRcdFx0XHRcdGlmIChpc0RlZmF1bHRSb3V0ZSkge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFbnN1cmUgdGhlIGRlZmF1bHQgcm91dGUgbWF0Y2hlcyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJvbmUgb2YgdGhlIHJvdXRlcyBkZWZpbmVkIGluIG0ucm91dGVcIilcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpc0RlZmF1bHRSb3V0ZSA9IHRydWVcclxuXHRcdFx0XHRcdG0ucm91dGUoYXJnMSwgdHJ1ZSlcclxuXHRcdFx0XHRcdGlzRGVmYXVsdFJvdXRlID0gZmFsc2VcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBsaXN0ZW5lciA9IG0ucm91dGUubW9kZSA9PT0gXCJoYXNoXCIgP1xyXG5cdFx0XHRcdFwib25oYXNoY2hhbmdlXCIgOlxyXG5cdFx0XHRcdFwib25wb3BzdGF0ZVwiXHJcblxyXG5cdFx0XHRnbG9iYWxbbGlzdGVuZXJdID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciBwYXRoID0gJGxvY2F0aW9uW20ucm91dGUubW9kZV1cclxuXHRcdFx0XHRpZiAobS5yb3V0ZS5tb2RlID09PSBcInBhdGhuYW1lXCIpIHBhdGggKz0gJGxvY2F0aW9uLnNlYXJjaFxyXG5cdFx0XHRcdGlmIChjdXJyZW50Um91dGUgIT09IG5vcm1hbGl6ZVJvdXRlKHBhdGgpKSByZWRpcmVjdChwYXRoKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IHNldFNjcm9sbFxyXG5cdFx0XHRnbG9iYWxbbGlzdGVuZXJdKClcclxuXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNvbmZpZzogbS5yb3V0ZVxyXG5cdFx0aWYgKHJvb3QuYWRkRXZlbnRMaXN0ZW5lciB8fCByb290LmF0dGFjaEV2ZW50KSB7XHJcblx0XHRcdHZhciBiYXNlID0gbS5yb3V0ZS5tb2RlICE9PSBcInBhdGhuYW1lXCIgPyAkbG9jYXRpb24ucGF0aG5hbWUgOiBcIlwiXHJcblx0XHRcdHJvb3QuaHJlZiA9IGJhc2UgKyBtb2Rlc1ttLnJvdXRlLm1vZGVdICsgdmRvbS5hdHRycy5ocmVmXHJcblx0XHRcdGlmIChyb290LmFkZEV2ZW50TGlzdGVuZXIpIHtcclxuXHRcdFx0XHRyb290LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKVxyXG5cdFx0XHRcdHJvb3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cm9vdC5kZXRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSlcclxuXHRcdFx0XHRyb290LmF0dGFjaEV2ZW50KFwib25jbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHRcdC8vIG0ucm91dGUocm91dGUsIHBhcmFtcywgc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSlcclxuXHRcdGlmIChpc1N0cmluZyhyb290KSkge1xyXG5cdFx0XHR2YXIgb2xkUm91dGUgPSBjdXJyZW50Um91dGVcclxuXHRcdFx0Y3VycmVudFJvdXRlID0gcm9vdFxyXG5cclxuXHRcdFx0dmFyIGFyZ3MgPSBhcmcxIHx8IHt9XHJcblx0XHRcdHZhciBxdWVyeUluZGV4ID0gY3VycmVudFJvdXRlLmluZGV4T2YoXCI/XCIpXHJcblx0XHRcdHZhciBwYXJhbXNcclxuXHJcblx0XHRcdGlmIChxdWVyeUluZGV4ID4gLTEpIHtcclxuXHRcdFx0XHRwYXJhbXMgPSBwYXJzZVF1ZXJ5U3RyaW5nKGN1cnJlbnRSb3V0ZS5zbGljZShxdWVyeUluZGV4ICsgMSkpXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cGFyYW1zID0ge31cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yICh2YXIgaSBpbiBhcmdzKSB7XHJcblx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZ3MsIGkpKSB7XHJcblx0XHRcdFx0XHRwYXJhbXNbaV0gPSBhcmdzW2ldXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKHBhcmFtcylcclxuXHRcdFx0dmFyIGN1cnJlbnRQYXRoXHJcblxyXG5cdFx0XHRpZiAocXVlcnlJbmRleCA+IC0xKSB7XHJcblx0XHRcdFx0Y3VycmVudFBhdGggPSBjdXJyZW50Um91dGUuc2xpY2UoMCwgcXVlcnlJbmRleClcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjdXJyZW50UGF0aCA9IGN1cnJlbnRSb3V0ZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocXVlcnlzdHJpbmcpIHtcclxuXHRcdFx0XHRjdXJyZW50Um91dGUgPSBjdXJyZW50UGF0aCArXHJcblx0XHRcdFx0XHQoY3VycmVudFBhdGguaW5kZXhPZihcIj9cIikgPT09IC0xID8gXCI/XCIgOiBcIiZcIikgK1xyXG5cdFx0XHRcdFx0cXVlcnlzdHJpbmdcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHJlcGxhY2VIaXN0b3J5ID1cclxuXHRcdFx0XHQoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyA/IGFyZzIgOiBhcmcxKSA9PT0gdHJ1ZSB8fFxyXG5cdFx0XHRcdG9sZFJvdXRlID09PSByb290XHJcblxyXG5cdFx0XHRpZiAoZ2xvYmFsLmhpc3RvcnkucHVzaFN0YXRlKSB7XHJcblx0XHRcdFx0dmFyIG1ldGhvZCA9IHJlcGxhY2VIaXN0b3J5ID8gXCJyZXBsYWNlU3RhdGVcIiA6IFwicHVzaFN0YXRlXCJcclxuXHRcdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IHNldFNjcm9sbFxyXG5cdFx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGdsb2JhbC5oaXN0b3J5W21ldGhvZF0obnVsbCwgJGRvY3VtZW50LnRpdGxlLFxyXG5cdFx0XHRcdFx0XHRtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZWRpcmVjdChtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCRsb2NhdGlvblttLnJvdXRlLm1vZGVdID0gY3VycmVudFJvdXRlXHJcblx0XHRcdFx0cmVkaXJlY3QobW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bS5yb3V0ZS5wYXJhbSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuXHRcdGlmICghcm91dGVQYXJhbXMpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiWW91IG11c3QgY2FsbCBtLnJvdXRlKGVsZW1lbnQsIGRlZmF1bHRSb3V0ZSwgXCIgK1xyXG5cdFx0XHRcdFwicm91dGVzKSBiZWZvcmUgY2FsbGluZyBtLnJvdXRlLnBhcmFtKClcIilcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIWtleSkge1xyXG5cdFx0XHRyZXR1cm4gcm91dGVQYXJhbXNcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcm91dGVQYXJhbXNba2V5XVxyXG5cdH1cclxuXHJcblx0bS5yb3V0ZS5tb2RlID0gXCJzZWFyY2hcIlxyXG5cclxuXHRmdW5jdGlvbiBub3JtYWxpemVSb3V0ZShyb3V0ZSkge1xyXG5cdFx0cmV0dXJuIHJvdXRlLnNsaWNlKG1vZGVzW20ucm91dGUubW9kZV0ubGVuZ3RoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcm91dGVCeVZhbHVlKHJvb3QsIHJvdXRlciwgcGF0aCkge1xyXG5cdFx0cm91dGVQYXJhbXMgPSB7fVxyXG5cclxuXHRcdHZhciBxdWVyeVN0YXJ0ID0gcGF0aC5pbmRleE9mKFwiP1wiKVxyXG5cdFx0aWYgKHF1ZXJ5U3RhcnQgIT09IC0xKSB7XHJcblx0XHRcdHJvdXRlUGFyYW1zID0gcGFyc2VRdWVyeVN0cmluZyhcclxuXHRcdFx0XHRwYXRoLnN1YnN0cihxdWVyeVN0YXJ0ICsgMSwgcGF0aC5sZW5ndGgpKVxyXG5cdFx0XHRwYXRoID0gcGF0aC5zdWJzdHIoMCwgcXVlcnlTdGFydClcclxuXHRcdH1cclxuXHJcblx0XHQvLyBHZXQgYWxsIHJvdXRlcyBhbmQgY2hlY2sgaWYgdGhlcmUnc1xyXG5cdFx0Ly8gYW4gZXhhY3QgbWF0Y2ggZm9yIHRoZSBjdXJyZW50IHBhdGhcclxuXHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXMocm91dGVyKVxyXG5cdFx0dmFyIGluZGV4ID0ga2V5cy5pbmRleE9mKHBhdGgpXHJcblxyXG5cdFx0aWYgKGluZGV4ICE9PSAtMSl7XHJcblx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW2tleXMgW2luZGV4XV0pXHJcblx0XHRcdHJldHVybiB0cnVlXHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgcm91dGUgaW4gcm91dGVyKSB7XHJcblx0XHRcdGlmIChoYXNPd24uY2FsbChyb3V0ZXIsIHJvdXRlKSkge1xyXG5cdFx0XHRcdGlmIChyb3V0ZSA9PT0gcGF0aCkge1xyXG5cdFx0XHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJbcm91dGVdKVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcIl5cIiArIHJvdXRlXHJcblx0XHRcdFx0XHQucmVwbGFjZSgvOlteXFwvXSs/XFwuezN9L2csIFwiKC4qPylcIilcclxuXHRcdFx0XHRcdC5yZXBsYWNlKC86W15cXC9dKy9nLCBcIihbXlxcXFwvXSspXCIpICsgXCJcXC8/JFwiKVxyXG5cclxuXHRcdFx0XHRpZiAobWF0Y2hlci50ZXN0KHBhdGgpKSB7XHJcblx0XHRcdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBuby1sb29wLWZ1bmMgKi9cclxuXHRcdFx0XHRcdHBhdGgucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdHZhciBrZXlzID0gcm91dGUubWF0Y2goLzpbXlxcL10rL2cpIHx8IFtdXHJcblx0XHRcdFx0XHRcdHZhciB2YWx1ZXMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSwgLTIpXHJcblx0XHRcdFx0XHRcdGZvckVhY2goa2V5cywgZnVuY3Rpb24gKGtleSwgaSkge1xyXG5cdFx0XHRcdFx0XHRcdHJvdXRlUGFyYW1zW2tleS5yZXBsYWNlKC86fFxcLi9nLCBcIlwiKV0gPVxyXG5cdFx0XHRcdFx0XHRcdFx0ZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlc1tpXSlcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJbcm91dGVdKVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC8qIGVzbGludC1lbmFibGUgbm8tbG9vcC1mdW5jICovXHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcm91dGVVbm9idHJ1c2l2ZShlKSB7XHJcblx0XHRlID0gZSB8fCBldmVudFxyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLm1ldGFLZXkgfHwgZS5zaGlmdEtleSB8fCBlLndoaWNoID09PSAyKSByZXR1cm5cclxuXHJcblx0XHRpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KClcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGUucmV0dXJuVmFsdWUgPSBmYWxzZVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0IHx8IGUuc3JjRWxlbWVudFxyXG5cdFx0dmFyIGFyZ3NcclxuXHJcblx0XHRpZiAobS5yb3V0ZS5tb2RlID09PSBcInBhdGhuYW1lXCIgJiYgY3VycmVudFRhcmdldC5zZWFyY2gpIHtcclxuXHRcdFx0YXJncyA9IHBhcnNlUXVlcnlTdHJpbmcoY3VycmVudFRhcmdldC5zZWFyY2guc2xpY2UoMSkpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhcmdzID0ge31cclxuXHRcdH1cclxuXHJcblx0XHR3aGlsZSAoY3VycmVudFRhcmdldCAmJiAhL2EvaS50ZXN0KGN1cnJlbnRUYXJnZXQubm9kZU5hbWUpKSB7XHJcblx0XHRcdGN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0LnBhcmVudE5vZGVcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjbGVhciBwZW5kaW5nUmVxdWVzdHMgYmVjYXVzZSB3ZSB3YW50IGFuIGltbWVkaWF0ZSByb3V0ZSBjaGFuZ2VcclxuXHRcdHBlbmRpbmdSZXF1ZXN0cyA9IDBcclxuXHRcdG0ucm91dGUoY3VycmVudFRhcmdldFttLnJvdXRlLm1vZGVdXHJcblx0XHRcdC5zbGljZShtb2Rlc1ttLnJvdXRlLm1vZGVdLmxlbmd0aCksIGFyZ3MpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTY3JvbGwoKSB7XHJcblx0XHRpZiAobS5yb3V0ZS5tb2RlICE9PSBcImhhc2hcIiAmJiAkbG9jYXRpb24uaGFzaCkge1xyXG5cdFx0XHQkbG9jYXRpb24uaGFzaCA9ICRsb2NhdGlvbi5oYXNoXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRnbG9iYWwuc2Nyb2xsVG8oMCwgMClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkUXVlcnlTdHJpbmcob2JqZWN0LCBwcmVmaXgpIHtcclxuXHRcdHZhciBkdXBsaWNhdGVzID0ge31cclxuXHRcdHZhciBzdHIgPSBbXVxyXG5cclxuXHRcdGZvciAodmFyIHByb3AgaW4gb2JqZWN0KSB7XHJcblx0XHRcdGlmIChoYXNPd24uY2FsbChvYmplY3QsIHByb3ApKSB7XHJcblx0XHRcdFx0dmFyIGtleSA9IHByZWZpeCA/IHByZWZpeCArIFwiW1wiICsgcHJvcCArIFwiXVwiIDogcHJvcFxyXG5cdFx0XHRcdHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wXVxyXG5cclxuXHRcdFx0XHRpZiAodmFsdWUgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpKVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoaXNPYmplY3QodmFsdWUpKSB7XHJcblx0XHRcdFx0XHRzdHIucHVzaChidWlsZFF1ZXJ5U3RyaW5nKHZhbHVlLCBrZXkpKVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcclxuXHRcdFx0XHRcdHZhciBrZXlzID0gW11cclxuXHRcdFx0XHRcdGR1cGxpY2F0ZXNba2V5XSA9IGR1cGxpY2F0ZXNba2V5XSB8fCB7fVxyXG5cdFx0XHRcdFx0LyogZXNsaW50LWRpc2FibGUgbm8tbG9vcC1mdW5jICovXHJcblx0XHRcdFx0XHRmb3JFYWNoKHZhbHVlLCBmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIG5vLWxvb3AtZnVuYyAqL1xyXG5cdFx0XHRcdFx0XHRpZiAoIWR1cGxpY2F0ZXNba2V5XVtpdGVtXSkge1xyXG5cdFx0XHRcdFx0XHRcdGR1cGxpY2F0ZXNba2V5XVtpdGVtXSA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRrZXlzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArXHJcblx0XHRcdFx0XHRcdFx0XHRlbmNvZGVVUklDb21wb25lbnQoaXRlbSkpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRzdHIucHVzaChrZXlzLmpvaW4oXCImXCIpKVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0c3RyLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArXHJcblx0XHRcdFx0XHRcdGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHN0ci5qb2luKFwiJlwiKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZyhzdHIpIHtcclxuXHRcdGlmIChzdHIgPT09IFwiXCIgfHwgc3RyID09IG51bGwpIHJldHVybiB7fVxyXG5cdFx0aWYgKHN0ci5jaGFyQXQoMCkgPT09IFwiP1wiKSBzdHIgPSBzdHIuc2xpY2UoMSlcclxuXHJcblx0XHR2YXIgcGFpcnMgPSBzdHIuc3BsaXQoXCImXCIpXHJcblx0XHR2YXIgcGFyYW1zID0ge31cclxuXHJcblx0XHRmb3JFYWNoKHBhaXJzLCBmdW5jdGlvbiAoc3RyaW5nKSB7XHJcblx0XHRcdHZhciBwYWlyID0gc3RyaW5nLnNwbGl0KFwiPVwiKVxyXG5cdFx0XHR2YXIga2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMF0pXHJcblx0XHRcdHZhciB2YWx1ZSA9IHBhaXIubGVuZ3RoID09PSAyID8gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMV0pIDogbnVsbFxyXG5cdFx0XHRpZiAocGFyYW1zW2tleV0gIT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmICghaXNBcnJheShwYXJhbXNba2V5XSkpIHBhcmFtc1trZXldID0gW3BhcmFtc1trZXldXVxyXG5cdFx0XHRcdHBhcmFtc1trZXldLnB1c2godmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBwYXJhbXNba2V5XSA9IHZhbHVlXHJcblx0XHR9KVxyXG5cclxuXHRcdHJldHVybiBwYXJhbXNcclxuXHR9XHJcblxyXG5cdG0ucm91dGUuYnVpbGRRdWVyeVN0cmluZyA9IGJ1aWxkUXVlcnlTdHJpbmdcclxuXHRtLnJvdXRlLnBhcnNlUXVlcnlTdHJpbmcgPSBwYXJzZVF1ZXJ5U3RyaW5nXHJcblxyXG5cdGZ1bmN0aW9uIHJlc2V0KHJvb3QpIHtcclxuXHRcdHZhciBjYWNoZUtleSA9IGdldENlbGxDYWNoZUtleShyb290KVxyXG5cdFx0Y2xlYXIocm9vdC5jaGlsZE5vZGVzLCBjZWxsQ2FjaGVbY2FjaGVLZXldKVxyXG5cdFx0Y2VsbENhY2hlW2NhY2hlS2V5XSA9IHVuZGVmaW5lZFxyXG5cdH1cclxuXHJcblx0bS5kZWZlcnJlZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpXHJcblx0XHRkZWZlcnJlZC5wcm9taXNlID0gcHJvcGlmeShkZWZlcnJlZC5wcm9taXNlKVxyXG5cdFx0cmV0dXJuIGRlZmVycmVkXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBwcm9waWZ5KHByb21pc2UsIGluaXRpYWxWYWx1ZSkge1xyXG5cdFx0dmFyIHByb3AgPSBtLnByb3AoaW5pdGlhbFZhbHVlKVxyXG5cdFx0cHJvbWlzZS50aGVuKHByb3ApXHJcblx0XHRwcm9wLnRoZW4gPSBmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRcdHJldHVybiBwcm9waWZ5KHByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpLCBpbml0aWFsVmFsdWUpXHJcblx0XHR9XHJcblxyXG5cdFx0cHJvcC5jYXRjaCA9IHByb3AudGhlbi5iaW5kKG51bGwsIG51bGwpXHJcblx0XHRyZXR1cm4gcHJvcFxyXG5cdH1cclxuXHQvLyBQcm9taXoubWl0aHJpbC5qcyB8IFpvbG1laXN0ZXIgfCBNSVRcclxuXHQvLyBhIG1vZGlmaWVkIHZlcnNpb24gb2YgUHJvbWl6LmpzLCB3aGljaCBkb2VzIG5vdCBjb25mb3JtIHRvIFByb21pc2VzL0ErXHJcblx0Ly8gZm9yIHR3byByZWFzb25zOlxyXG5cdC8vXHJcblx0Ly8gMSkgYHRoZW5gIGNhbGxiYWNrcyBhcmUgY2FsbGVkIHN5bmNocm9ub3VzbHkgKGJlY2F1c2Ugc2V0VGltZW91dCBpcyB0b29cclxuXHQvLyAgICBzbG93LCBhbmQgdGhlIHNldEltbWVkaWF0ZSBwb2x5ZmlsbCBpcyB0b28gYmlnXHJcblx0Ly9cclxuXHQvLyAyKSB0aHJvd2luZyBzdWJjbGFzc2VzIG9mIEVycm9yIGNhdXNlIHRoZSBlcnJvciB0byBiZSBidWJibGVkIHVwIGluc3RlYWRcclxuXHQvLyAgICBvZiB0cmlnZ2VyaW5nIHJlamVjdGlvbiAoYmVjYXVzZSB0aGUgc3BlYyBkb2VzIG5vdCBhY2NvdW50IGZvciB0aGVcclxuXHQvLyAgICBpbXBvcnRhbnQgdXNlIGNhc2Ugb2YgZGVmYXVsdCBicm93c2VyIGVycm9yIGhhbmRsaW5nLCBpLmUuIG1lc3NhZ2Ugdy9cclxuXHQvLyAgICBsaW5lIG51bWJlcilcclxuXHJcblx0dmFyIFJFU09MVklORyA9IDFcclxuXHR2YXIgUkVKRUNUSU5HID0gMlxyXG5cdHZhciBSRVNPTFZFRCA9IDNcclxuXHR2YXIgUkVKRUNURUQgPSA0XHJcblxyXG5cdGZ1bmN0aW9uIERlZmVycmVkKG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXNcclxuXHRcdHZhciBzdGF0ZSA9IDBcclxuXHRcdHZhciBwcm9taXNlVmFsdWUgPSAwXHJcblx0XHR2YXIgbmV4dCA9IFtdXHJcblxyXG5cdFx0c2VsZi5wcm9taXNlID0ge31cclxuXHJcblx0XHRzZWxmLnJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0aWYgKCFzdGF0ZSkge1xyXG5cdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlXHJcblx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkdcclxuXHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBzZWxmXHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5yZWplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0aWYgKCFzdGF0ZSkge1xyXG5cdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlXHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkdcclxuXHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBzZWxmXHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5wcm9taXNlLnRoZW4gPSBmdW5jdGlvbiAob25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcclxuXHRcdFx0dmFyIGRlZmVycmVkID0gbmV3IERlZmVycmVkKG9uU3VjY2Vzcywgb25GYWlsdXJlKVxyXG5cclxuXHRcdFx0aWYgKHN0YXRlID09PSBSRVNPTFZFRCkge1xyXG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocHJvbWlzZVZhbHVlKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHN0YXRlID09PSBSRUpFQ1RFRCkge1xyXG5cdFx0XHRcdGRlZmVycmVkLnJlamVjdChwcm9taXNlVmFsdWUpXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bmV4dC5wdXNoKGRlZmVycmVkKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGZpbmlzaCh0eXBlKSB7XHJcblx0XHRcdHN0YXRlID0gdHlwZSB8fCBSRUpFQ1RFRFxyXG5cdFx0XHRuZXh0Lm1hcChmdW5jdGlvbiAoZGVmZXJyZWQpIHtcclxuXHRcdFx0XHRpZiAoc3RhdGUgPT09IFJFU09MVkVEKSB7XHJcblx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHByb21pc2VWYWx1ZSlcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gdGhlbm5hYmxlKHRoZW4sIHN1Y2Nlc3MsIGZhaWx1cmUsIG5vdFRoZW5uYWJsZSkge1xyXG5cdFx0XHRpZiAoKChwcm9taXNlVmFsdWUgIT0gbnVsbCAmJiBpc09iamVjdChwcm9taXNlVmFsdWUpKSB8fFxyXG5cdFx0XHRcdFx0aXNGdW5jdGlvbihwcm9taXNlVmFsdWUpKSAmJiBpc0Z1bmN0aW9uKHRoZW4pKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdC8vIGNvdW50IHByb3RlY3RzIGFnYWluc3QgYWJ1c2UgY2FsbHMgZnJvbSBzcGVjIGNoZWNrZXJcclxuXHRcdFx0XHRcdHZhciBjb3VudCA9IDBcclxuXHRcdFx0XHRcdHRoZW4uY2FsbChwcm9taXNlVmFsdWUsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoY291bnQrKykgcmV0dXJuXHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlXHJcblx0XHRcdFx0XHRcdHN1Y2Nlc3MoKVxyXG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb3VudCsrKSByZXR1cm5cclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWVcclxuXHRcdFx0XHRcdFx0ZmFpbHVyZSgpXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKVxyXG5cdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZVxyXG5cdFx0XHRcdFx0ZmFpbHVyZSgpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5vdFRoZW5uYWJsZSgpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBmaXJlKCkge1xyXG5cdFx0XHQvLyBjaGVjayBpZiBpdCdzIGEgdGhlbmFibGVcclxuXHRcdFx0dmFyIHRoZW5cclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR0aGVuID0gcHJvbWlzZVZhbHVlICYmIHByb21pc2VWYWx1ZS50aGVuXHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSlcclxuXHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlXHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkdcclxuXHRcdFx0XHRyZXR1cm4gZmlyZSgpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChzdGF0ZSA9PT0gUkVKRUNUSU5HKSB7XHJcblx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhlbm5hYmxlKHRoZW4sIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFU09MVklOR1xyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9LCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkdcclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fSwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRpZiAoc3RhdGUgPT09IFJFU09MVklORyAmJiBpc0Z1bmN0aW9uKG9uU3VjY2VzcykpIHtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gb25TdWNjZXNzKHByb21pc2VWYWx1ZSlcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc3RhdGUgPT09IFJFSkVDVElORyAmJiBpc0Z1bmN0aW9uKG9uRmFpbHVyZSkpIHtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gb25GYWlsdXJlKHByb21pc2VWYWx1ZSlcclxuXHRcdFx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSlcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGVcclxuXHRcdFx0XHRcdHJldHVybiBmaW5pc2goKVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHByb21pc2VWYWx1ZSA9PT0gc2VsZikge1xyXG5cdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gVHlwZUVycm9yKClcclxuXHRcdFx0XHRcdGZpbmlzaCgpXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoZW5uYWJsZSh0aGVuLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGZpbmlzaChSRVNPTFZFRClcclxuXHRcdFx0XHRcdH0sIGZpbmlzaCwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRmaW5pc2goc3RhdGUgPT09IFJFU09MVklORyAmJiBSRVNPTFZFRClcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bS5kZWZlcnJlZC5vbmVycm9yID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmICh0eXBlLmNhbGwoZSkgPT09IFwiW29iamVjdCBFcnJvcl1cIiAmJlxyXG5cdFx0XHRcdCEvIEVycm9yLy50ZXN0KGUuY29uc3RydWN0b3IudG9TdHJpbmcoKSkpIHtcclxuXHRcdFx0cGVuZGluZ1JlcXVlc3RzID0gMFxyXG5cdFx0XHR0aHJvdyBlXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtLnN5bmMgPSBmdW5jdGlvbiAoYXJncykge1xyXG5cdFx0dmFyIGRlZmVycmVkID0gbS5kZWZlcnJlZCgpXHJcblx0XHR2YXIgb3V0c3RhbmRpbmcgPSBhcmdzLmxlbmd0aFxyXG5cdFx0dmFyIHJlc3VsdHMgPSBbXVxyXG5cdFx0dmFyIG1ldGhvZCA9IFwicmVzb2x2ZVwiXHJcblxyXG5cdFx0ZnVuY3Rpb24gc3luY2hyb25pemVyKHBvcywgcmVzb2x2ZWQpIHtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0XHRcdHJlc3VsdHNbcG9zXSA9IHZhbHVlXHJcblx0XHRcdFx0aWYgKCFyZXNvbHZlZCkgbWV0aG9kID0gXCJyZWplY3RcIlxyXG5cdFx0XHRcdGlmICgtLW91dHN0YW5kaW5nID09PSAwKSB7XHJcblx0XHRcdFx0XHRkZWZlcnJlZC5wcm9taXNlKHJlc3VsdHMpXHJcblx0XHRcdFx0XHRkZWZlcnJlZFttZXRob2RdKHJlc3VsdHMpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB2YWx1ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGFyZ3MubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRmb3JFYWNoKGFyZ3MsIGZ1bmN0aW9uIChhcmcsIGkpIHtcclxuXHRcdFx0XHRhcmcudGhlbihzeW5jaHJvbml6ZXIoaSwgdHJ1ZSksIHN5bmNocm9uaXplcihpLCBmYWxzZSkpXHJcblx0XHRcdH0pXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRkZWZlcnJlZC5yZXNvbHZlKFtdKVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgfVxyXG5cclxuXHRmdW5jdGlvbiBoYW5kbGVKc29ucChvcHRpb25zKSB7XHJcblx0XHR2YXIgY2FsbGJhY2tLZXkgPSBcIm1pdGhyaWxfY2FsbGJhY2tfXCIgK1xyXG5cdFx0XHRuZXcgRGF0ZSgpLmdldFRpbWUoKSArIFwiX1wiICtcclxuXHRcdFx0KE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDFlMTYpKS50b1N0cmluZygzNilcclxuXHJcblx0XHR2YXIgc2NyaXB0ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIilcclxuXHJcblx0XHRnbG9iYWxbY2FsbGJhY2tLZXldID0gZnVuY3Rpb24gKHJlc3ApIHtcclxuXHRcdFx0c2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KVxyXG5cdFx0XHRvcHRpb25zLm9ubG9hZCh7XHJcblx0XHRcdFx0dHlwZTogXCJsb2FkXCIsXHJcblx0XHRcdFx0dGFyZ2V0OiB7XHJcblx0XHRcdFx0XHRyZXNwb25zZVRleHQ6IHJlc3BcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdGdsb2JhbFtjYWxsYmFja0tleV0gPSB1bmRlZmluZWRcclxuXHRcdH1cclxuXHJcblx0XHRzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0c2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KVxyXG5cclxuXHRcdFx0b3B0aW9ucy5vbmVycm9yKHtcclxuXHRcdFx0XHR0eXBlOiBcImVycm9yXCIsXHJcblx0XHRcdFx0dGFyZ2V0OiB7XHJcblx0XHRcdFx0XHRzdGF0dXM6IDUwMCxcclxuXHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogSlNPTi5zdHJpbmdpZnkoe1xyXG5cdFx0XHRcdFx0XHRlcnJvcjogXCJFcnJvciBtYWtpbmcganNvbnAgcmVxdWVzdFwiXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0Z2xvYmFsW2NhbGxiYWNrS2V5XSA9IHVuZGVmaW5lZFxyXG5cclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblxyXG5cdFx0c2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblxyXG5cdFx0c2NyaXB0LnNyYyA9IG9wdGlvbnMudXJsICtcclxuXHRcdFx0KG9wdGlvbnMudXJsLmluZGV4T2YoXCI/XCIpID4gMCA/IFwiJlwiIDogXCI/XCIpICtcclxuXHRcdFx0KG9wdGlvbnMuY2FsbGJhY2tLZXkgPyBvcHRpb25zLmNhbGxiYWNrS2V5IDogXCJjYWxsYmFja1wiKSArXHJcblx0XHRcdFwiPVwiICsgY2FsbGJhY2tLZXkgK1xyXG5cdFx0XHRcIiZcIiArIGJ1aWxkUXVlcnlTdHJpbmcob3B0aW9ucy5kYXRhIHx8IHt9KVxyXG5cclxuXHRcdCRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNyZWF0ZVhocihvcHRpb25zKSB7XHJcblx0XHR2YXIgeGhyID0gbmV3IGdsb2JhbC5YTUxIdHRwUmVxdWVzdCgpXHJcblx0XHR4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIHRydWUsIG9wdGlvbnMudXNlcixcclxuXHRcdFx0b3B0aW9ucy5wYXNzd29yZClcclxuXHJcblx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcclxuXHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xyXG5cdFx0XHRcdFx0b3B0aW9ucy5vbmxvYWQoe3R5cGU6IFwibG9hZFwiLCB0YXJnZXQ6IHhocn0pXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG9wdGlvbnMub25lcnJvcih7dHlwZTogXCJlcnJvclwiLCB0YXJnZXQ6IHhocn0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG9wdGlvbnMuc2VyaWFsaXplID09PSBKU09OLnN0cmluZ2lmeSAmJlxyXG5cdFx0XHRcdG9wdGlvbnMuZGF0YSAmJlxyXG5cdFx0XHRcdG9wdGlvbnMubWV0aG9kICE9PSBcIkdFVFwiKSB7XHJcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXHJcblx0XHRcdFx0XCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG9wdGlvbnMuZGVzZXJpYWxpemUgPT09IEpTT04ucGFyc2UpIHtcclxuXHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0LypcIilcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNGdW5jdGlvbihvcHRpb25zLmNvbmZpZykpIHtcclxuXHRcdFx0dmFyIG1heWJlWGhyID0gb3B0aW9ucy5jb25maWcoeGhyLCBvcHRpb25zKVxyXG5cdFx0XHRpZiAobWF5YmVYaHIgIT0gbnVsbCkgeGhyID0gbWF5YmVYaHJcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgZGF0YSA9IG9wdGlvbnMubWV0aG9kID09PSBcIkdFVFwiIHx8ICFvcHRpb25zLmRhdGEgPyBcIlwiIDogb3B0aW9ucy5kYXRhXHJcblxyXG5cdFx0aWYgKGRhdGEgJiYgIWlzU3RyaW5nKGRhdGEpICYmIGRhdGEuY29uc3RydWN0b3IgIT09IGdsb2JhbC5Gb3JtRGF0YSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJSZXF1ZXN0IGRhdGEgc2hvdWxkIGJlIGVpdGhlciBiZSBhIHN0cmluZyBvciBcIiArXHJcblx0XHRcdFx0XCJGb3JtRGF0YS4gQ2hlY2sgdGhlIGBzZXJpYWxpemVgIG9wdGlvbiBpbiBgbS5yZXF1ZXN0YFwiKVxyXG5cdFx0fVxyXG5cclxuXHRcdHhoci5zZW5kKGRhdGEpXHJcblx0XHRyZXR1cm4geGhyXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhamF4KG9wdGlvbnMpIHtcclxuXHRcdGlmIChvcHRpb25zLmRhdGFUeXBlICYmIG9wdGlvbnMuZGF0YVR5cGUudG9Mb3dlckNhc2UoKSA9PT0gXCJqc29ucFwiKSB7XHJcblx0XHRcdHJldHVybiBoYW5kbGVKc29ucChvcHRpb25zKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGNyZWF0ZVhocihvcHRpb25zKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYmluZERhdGEob3B0aW9ucywgZGF0YSwgc2VyaWFsaXplKSB7XHJcblx0XHRpZiAob3B0aW9ucy5tZXRob2QgPT09IFwiR0VUXCIgJiYgb3B0aW9ucy5kYXRhVHlwZSAhPT0gXCJqc29ucFwiKSB7XHJcblx0XHRcdHZhciBwcmVmaXggPSBvcHRpb25zLnVybC5pbmRleE9mKFwiP1wiKSA8IDAgPyBcIj9cIiA6IFwiJlwiXHJcblx0XHRcdHZhciBxdWVyeXN0cmluZyA9IGJ1aWxkUXVlcnlTdHJpbmcoZGF0YSlcclxuXHRcdFx0b3B0aW9ucy51cmwgKz0gKHF1ZXJ5c3RyaW5nID8gcHJlZml4ICsgcXVlcnlzdHJpbmcgOiBcIlwiKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0b3B0aW9ucy5kYXRhID0gc2VyaWFsaXplKGRhdGEpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBwYXJhbWV0ZXJpemVVcmwodXJsLCBkYXRhKSB7XHJcblx0XHRpZiAoZGF0YSkge1xyXG5cdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgvOlthLXpdXFx3Ky9naSwgZnVuY3Rpb24gKHRva2VuKXtcclxuXHRcdFx0XHR2YXIga2V5ID0gdG9rZW4uc2xpY2UoMSlcclxuXHRcdFx0XHR2YXIgdmFsdWUgPSBkYXRhW2tleV1cclxuXHRcdFx0XHRkZWxldGUgZGF0YVtrZXldXHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlXHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdXJsXHJcblx0fVxyXG5cclxuXHRtLnJlcXVlc3QgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cdFx0aWYgKG9wdGlvbnMuYmFja2dyb3VuZCAhPT0gdHJ1ZSkgbS5zdGFydENvbXB1dGF0aW9uKClcclxuXHRcdHZhciBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpXHJcblx0XHR2YXIgaXNKU09OUCA9IG9wdGlvbnMuZGF0YVR5cGUgJiZcclxuXHRcdFx0b3B0aW9ucy5kYXRhVHlwZS50b0xvd2VyQ2FzZSgpID09PSBcImpzb25wXCJcclxuXHJcblx0XHR2YXIgc2VyaWFsaXplLCBkZXNlcmlhbGl6ZSwgZXh0cmFjdFxyXG5cclxuXHRcdGlmIChpc0pTT05QKSB7XHJcblx0XHRcdHNlcmlhbGl6ZSA9IG9wdGlvbnMuc2VyaWFsaXplID1cclxuXHRcdFx0ZGVzZXJpYWxpemUgPSBvcHRpb25zLmRlc2VyaWFsaXplID0gaWRlbnRpdHlcclxuXHJcblx0XHRcdGV4dHJhY3QgPSBmdW5jdGlvbiAoanNvbnApIHsgcmV0dXJuIGpzb25wLnJlc3BvbnNlVGV4dCB9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZXJpYWxpemUgPSBvcHRpb25zLnNlcmlhbGl6ZSA9IG9wdGlvbnMuc2VyaWFsaXplIHx8IEpTT04uc3RyaW5naWZ5XHJcblxyXG5cdFx0XHRkZXNlcmlhbGl6ZSA9IG9wdGlvbnMuZGVzZXJpYWxpemUgPVxyXG5cdFx0XHRcdG9wdGlvbnMuZGVzZXJpYWxpemUgfHwgSlNPTi5wYXJzZVxyXG5cdFx0XHRleHRyYWN0ID0gb3B0aW9ucy5leHRyYWN0IHx8IGZ1bmN0aW9uICh4aHIpIHtcclxuXHRcdFx0XHRpZiAoeGhyLnJlc3BvbnNlVGV4dC5sZW5ndGggfHwgZGVzZXJpYWxpemUgIT09IEpTT04ucGFyc2UpIHtcclxuXHRcdFx0XHRcdHJldHVybiB4aHIucmVzcG9uc2VUZXh0XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiBudWxsXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0b3B0aW9ucy5tZXRob2QgPSAob3B0aW9ucy5tZXRob2QgfHwgXCJHRVRcIikudG9VcHBlckNhc2UoKVxyXG5cdFx0b3B0aW9ucy51cmwgPSBwYXJhbWV0ZXJpemVVcmwob3B0aW9ucy51cmwsIG9wdGlvbnMuZGF0YSlcclxuXHRcdGJpbmREYXRhKG9wdGlvbnMsIG9wdGlvbnMuZGF0YSwgc2VyaWFsaXplKVxyXG5cdFx0b3B0aW9ucy5vbmxvYWQgPSBvcHRpb25zLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXYpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRldiA9IGV2IHx8IGV2ZW50XHJcblx0XHRcdFx0dmFyIHJlc3BvbnNlID0gZGVzZXJpYWxpemUoZXh0cmFjdChldi50YXJnZXQsIG9wdGlvbnMpKVxyXG5cdFx0XHRcdGlmIChldi50eXBlID09PSBcImxvYWRcIikge1xyXG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMudW53cmFwU3VjY2Vzcykge1xyXG5cdFx0XHRcdFx0XHRyZXNwb25zZSA9IG9wdGlvbnMudW53cmFwU3VjY2VzcyhyZXNwb25zZSwgZXYudGFyZ2V0KVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmIChpc0FycmF5KHJlc3BvbnNlKSAmJiBvcHRpb25zLnR5cGUpIHtcclxuXHRcdFx0XHRcdFx0Zm9yRWFjaChyZXNwb25zZSwgZnVuY3Rpb24gKHJlcywgaSkge1xyXG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNlW2ldID0gbmV3IG9wdGlvbnMudHlwZShyZXMpXHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG9wdGlvbnMudHlwZSkge1xyXG5cdFx0XHRcdFx0XHRyZXNwb25zZSA9IG5ldyBvcHRpb25zLnR5cGUocmVzcG9uc2UpXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSlcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMudW53cmFwRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBvcHRpb25zLnVud3JhcEVycm9yKHJlc3BvbnNlLCBldi50YXJnZXQpXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KHJlc3BvbnNlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdGRlZmVycmVkLnJlamVjdChlKVxyXG5cdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKVxyXG5cdFx0XHR9IGZpbmFsbHkge1xyXG5cdFx0XHRcdGlmIChvcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uZW5kQ29tcHV0YXRpb24oKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0YWpheChvcHRpb25zKVxyXG5cdFx0ZGVmZXJyZWQucHJvbWlzZSA9IHByb3BpZnkoZGVmZXJyZWQucHJvbWlzZSwgb3B0aW9ucy5pbml0aWFsVmFsdWUpXHJcblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIG1cclxufSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuIl19
