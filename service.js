const path_api = "https://ddragon.leagueoflegends.com";
// const quetrae las versiones de la API de personajes de League of Legends siendo la priimera la ultima version
 async function getVersion() {
    try {
        const response = await fetch(path_api + "/api/versions.json");
        const data = await response.json();
        return data[0];
    } catch (error) {
        return null;
    }
}



//Funtion para traer la lista de campeones de la version mas reciente
async function getChampions(rol) {
    try {
        const version = await getVersion()
        const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/es_ES/champion.json`;
        const response = await fetch(url);
        const data = await response.json();
        if(!rol){
            return Object.values(data.data);

        }else{
            const champions = Object.values(data.data).filter(champion => {
                const roles =champion.tags;
                return (roles.includes(rol))
            });
            return champions;
        }
    } catch (error) {
        return null;
}
}

//Funtion para traer el campeon por el nombre de la version mas reciente
async function getChampion(name){
    try {
        const version = await getVersion();
        const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/es_ES/champion/${name}.json`;
        const response = await fetch(url);
        const data = await response.json();
        return data.data;
    } catch (error) {
        return null;
    }
}

//Funtion para traer la lista de roles todos o filtrado por campeon
async function getRoles(name){
    let roles = [];
    let championsJson;
    let champions = [];
    try {
        if(name){
            championsJson = await getChampion(name);
            champions.push(championsJson.data);
        }else{
            championsJson = await getChampions();
        }
        champions = Object.values(championsJson)
        for(const champion of  champions){
            const chamRoles = champion.tags;
             for (const rol of chamRoles) {
                if( !roles.includes(rol)){
                    roles.push(rol)
                }
            }
        }
        return roles;
    }catch (error){
        return [];
    }
}


export {getChampions, getChampion, getVersion, getRoles}