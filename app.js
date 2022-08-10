mapboxgl.accessToken = 'pk.eyJ1IjoiZ2F3YzF1dXUiLCJhIjoiY2w2MXp2MTA0MGUxdDNibXJ3bHdkaGR4OCJ9.FvQf2m-7dp7ezc0X8hitIQ';
const form = document.querySelector("#weatherForm");
const city = document.querySelector('.cityName');
const temp = document.querySelector('.temp');
const desc = document.querySelector('.desc');
const humidity = document.querySelector('.humidity');
const date = document.querySelector('.date');
const icon = document.querySelector('.icon');
const lisbonCoords = [-9.1333,38.7167]

const start = {
    center: lisbonCoords,
    zoom: 8,
    pitch: 0,
    bearing: 0
    };
const end = {
    // center: [74.5, 40],
    // zoom: 2
    center: lisbonCoords,
    zoom: 8,
    bearing: 0,
    pitch: 0,
    };
    const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v11',
    projection: 'globe',
    ...start
    });

    let marker = new mapboxgl.Marker()
        .setLngLat(end.center)
        .addTo(map);
    
     
    map.on('style.load', () => {
    // Custom atmosphere styling
    map.setFog({
    'color': 'rgb(220, 159, 159)', // Pink fog / lower atmosphere
    'high-color': 'rgb(36, 92, 223)', // Blue sky / upper atmosphere
    'horizon-blend': 0.4 // Exaggerate atmosphere (default is .1)
    });
     
    map.addSource('mapbox-dem', {
    'type': 'raster-dem',
    'url': 'mapbox://mapbox.terrain-rgb'
    });
     
    map.setTerrain({
    'source': 'mapbox-dem',
    'exaggeration': 1.5
    });
    });
     
    let isAtStart = true;

window.addEventListener('load', async (e) => {
    try{
    const cityName = 'Lisbon';
    // const apiID = '69020ee5934952d9bfbd838ef3f6b3f9'
    const config = {params: {q: cityName, appid:'69020ee5934952d9bfbd838ef3f6b3f9', units: 'metric',lang: 'pl' }};
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather`,config);
    setValues(res);
    addIcon(res);
    form.elements.q.value='';
    }catch(e){
        console.log("ERROR!",e)
    }
})


form.addEventListener('submit', async (e) =>{
    try{
    e.preventDefault();
    icon.firstChild.remove();
    const cityName = form.elements.q.value;
    const config = {params: {q: cityName, appid:'69020ee5934952d9bfbd838ef3f6b3f9', units: 'metric',lang: 'pl' }};
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather`,config);
    
    setValues(res);
    addIcon(res);
    
    end.center = [res.data.coord.lon,res.data.coord.lat] || lisbonCoords;
    start.center=end.center || lisbonCoords;

    marker
    .setLngLat(end.center)
    .addTo(map);

    // depending on whether we're currently at point a or b,
        // aim for point a or b
        const target = isAtStart ? end : start;
        isAtStart = !isAtStart;
         
        map.flyTo({
        ...target, // Fly to the selected target
        duration: 7000, // Animate over 12 seconds
        essential: true // This animation is considered essential with
        //respect to prefers-reduced-motion
        });
        

    // fly([res.data.coord.lon,res.data.coord.lat])
    form.elements.q.value='';
    }catch(e){
        console.log("ERROR!",e);
    }
})

const getDate = () =>{
    const d = new Date();
    const year = d.getFullYear();
    const day = d.getDate();
    const month = d.getMonth()+1;
    if(day<10 && month<10){
        return `${year}-0${month}-0${day}`
    }else if(day<10){
        return `${year}-${month}-0${day}`;
    }else if(month<10){
        return `${year}-0${month}-${day}`;
    }else {
        return `${year}-${month}-${day}`;
    }
}

const setValues = (data) =>{
    city.innerText=data.data.name;
    temp.innerText=Math.floor(data.data.main.temp);
    desc.innerText=data.data.weather[0].description;
    humidity.innerText=data.data.main.humidity;
    date.innerText = getDate();
}

const addIcon = (res) =>{
    const newIcon = document.createElement('IMG');
    const iconCode=res.data.weather[0].icon;
    newIcon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    icon.append(newIcon);    
}


    
         
        
    
