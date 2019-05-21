var config = require('../config');

const apiKey = config.googleDirectionsAPI.key

const routesNearHome = [
	{
		origin: {latitude:11.016079, longitude:-74.838379},
		destination: {latitude:10.989161, longitude:-74.822785}
	},
	{
		origin: {latitude:10.974956, longitude:-74.789833},
		destination: {latitude:10.976399, longitude:-74.832780}
	},
	{
		origin: {latitude:11.021614, longitude:-74.862930},
		destination: {latitude:10.998394, longitude:-74.840335}
	},
	// {
	// 	origin: {latitude:, longitude:},
	// 	destination: {latitude:, longitude:}'
	// },
	// {
	// 	origin: {latitude:, longitude:},
	// 	destination: {latitude:, longitude:}
	// },
	// {
	// 	origin: {latitude:, longitude:},
	// 	destination: {latitude:, longitude:}
	// },
	// // {
	// // 	origin: '',
	// // 	destination: ''
	// // },
	// {
	// 	origin: {latitude:, longitude:},
	// 	destination: {latitude:, longitude:}
	// },
	// {
	// 	origin: {latitude:, longitude:},
	// 	destination: {latitude:, longitude:}
	// },
	// {
	// 	origin: {latitude:, longitude:},
	// 	destination: {latitude:, longitude:}
	// },
	// {
	// 	origin: {latitude:, longitude:},
	// 	destination: {latitude:, longitude:}
	// },
]

exports.getSimulatorPolylines = getSimulatorPolylines

//Returns the coordinates for the each route located in the routesNearHome array
async function getSimulatorPolylines(cb) {
	console.log('getSimulatorPolylines called ')

	const routes = routesNearHome;
	var polylines = []

	for(var i = 0; i < routes.length; i++) {
		var finalCoords = []

		await getDirections(routes[i].origin, routes[i].destination, (coords) => {
			finalCoords = coords
		})

		//reverse coords for seamless looping car route
		await getDirections(routes[i].destination, routes[i].origin, (coords) => {
			finalCoords = finalCoords.concat(coords)
		})

		polylines.push(finalCoords)
	}
		
	cb(polylines)
}

const iterateThruRoute = (routes) => {
  const nextRoutes = routes.slice(1, routes.length) //remove first elem

  if(coords.length != 0)
      this.animate(coords[0], () => { this.animateThruCoords(nextCoords) })
}

const getDirections = (origin, destination, cb) => {
	console.log(origin.latitude+'ajacv');
	return fetch('https://maps.googleapis.com/maps/api/directions/json?origin='+origin.latitude+','+origin.longitude+'&destination='+destination.latitude+','+destination.longitude+'&key='+apiKey)
		.then((res) => res.json())
		.then((resJson) => {
			var polylineCoords = null;

			if (resJson.routes.length)
      			polylineCoords = decode(resJson.routes[0].overview_polyline.points)
      		else
      			console.log(resJson.error_message, resJson.status)

			// console.log('==================================')
			// console.log('Origin: ', origin, 'destination: ', destination)
			// console.log('Polylines: ', polylineCoords)
			// // console.log('JSON Data: ', resJson)
			// console.log('==================================')
			console.log(polylineCoords)
			cb(polylineCoords)
		})
		.catch((err) => {
			console.error(err+'jodaaaaquemkda')
		})
}


const formatRouteAddresses = (routes) => {
	var formattedRoutes = []

	routes.forEach((route) => {
		formattedRoutes.push({ origin: {latitude:route.origin.latitude, longitude:route.origin.longitude}, destination: {latitude:route.destination.latitude, longitude:route.destination.latitude} })
	})

	return formattedRoutes
}	

//Replaces commas and spaces with '+' signs
const formatAddress = (address) => {
	var formattedAddress = address.split(',').join('').split(' ').join('+')

	return formattedAddress
}

const disneylandDirections = (cb) => {
	fetch('https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key='+apiKey)
		.then((res) => res.json())
		.then((resJson) => {
			var polylineCoords = null;

			if (resJson.routes.length)
		        polylineCoords = decode(resJson.routes[0].overview_polyline.points)

	      	cb(polylineCoords)
		})
		.catch((err) => {
			console.error(err)
		})
}

const getExamplePolyline = (cb) => {
	const origin = '306+W+38TH+ST+AUSTIN+TX'
	const destination="Kerbey+Lane+Cafe"

	fetch('https://maps.googleapis.com/maps/api/directions/json?origin='+origin+'&destination='+destination+'&key='+apiKey)
		.then((res) => res.json())
		.then((resJson) => {
			var polylineCoords = null;

			if (resJson.routes.length)
      	polylineCoords = decode(resJson.routes[0].overview_polyline.points)

      // console.log('POLYLINE COORDS: ', polylineCoords)

    	cb(polylineCoords)
		})
		.catch((err) => {
			console.error(err)
		})
}

//Decodes encoded polyline strings returned from the Google Directions API
//Can find source at this url: https://github.com/react-native-community/react-native-maps/issues/929#issuecomment-271365235
const decode = (t,e) => {
	for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;){a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])}return d=d.map(function(t){return{latitude:t[0],longitude:t[1]}})
}
