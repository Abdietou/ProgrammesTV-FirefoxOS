data={}
if (navigator.onLine) {
    var xhr = new XMLHttpRequest({mozSystem: true});
    xhr.addEventListener("progress", updateProgress);
    xhr.addEventListener("load", transferComplete);
    url="http://xmltv.dtdns.net/alacarte/ddl?fichier=/xmltv_site/xmlPerso/indianboy.xml"
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {

    if (xhr.readyState == 4) {
        data=xml2json(xhr.responseXML)
        localStorage['data']=JSON.stringify(data)
        // process_xml(data)

   } 

}
   xhr.send();

} else {
      if (!!localStorage['data']) {
        console.log( JSON.parse( localStorage['data'])["programmes"][0])
         // process_xml(localStorage[url]);
        }  
}


for(d = 0; d < 18; d++){
	
    //Création de la div général
    divGeneral = document.createElement('div');
    divGeneral.id = d;
	
    var divB = document.createElement('div');
    divB.id = 'b' + d;
    
    divGeneral.appendChild(divB);
    var doclass = document.getElementsByClassName('swipe-wrap');
    doclass[0].appendChild(divGeneral);
}

function demain(){
    currentDate = new Date(new Date().getTime());
    day = ("0"+(currentDate.getDate()+1)).slice(-2);
    month = ("0"+(currentDate.getMonth()+1)).slice(-2); 
    year = currentDate.getFullYear()
    return ""+year+""+month+""+day
}

function ch_json(ch){
    var channelId = ch.getAttribute("id");
    var channelName = ch.getElementsByTagName("display-name")[0].textContent;
    return {"channelId":channelId,"channelName":channelName} 
    
}
function pr_json(pr){
    resPr={}
    programmeId = pr.getAttribute("channel");
    programmeStop = pr.getAttribute("stop");
    programmeStart = pr.getAttribute("start");
    programmeTitre = pr.getElementsByTagName("title")[0].textContent;
     try{programmeSousTitre = "("+pr.getElementsByTagName("sub-title")[0].textContent+")";}
        catch(exceptiondesc){ programmeSousTitre = null;}
     try{programmeDesc = pr.getElementsByTagName("desc")[0].textContent;}
        catch(exceptiondesc){ programmeDesc = null;}

    programmeType = pr.getElementsByTagName("category")[0].textContent;
    programmeCredits = pr.getElementsByTagName("credits")[0];
   
    resPr['programmeId'] = programmeId  
    resPr['programmeStop'] = programmeStop  
    resPr['programmeStart'] = programmeStart  
    resPr['programmeTitre'] = programmeTitre  
    resPr['programmeSousTitre'] = programmeSousTitre  
    resPr['programmeDesc'] = programmeDesc  
    resPr['programmeType'] = programmeType  
    resPr['programmeCredits'] = programmeCredits  
   
    if(programmeType ==  'Documentaire' || programmeType == 'Feuilleton' ||
        programmeType == 'Film' || programmeType == 'Téléfilm' ||
        programmeType == 'Série'){

        try{
            programmeDirecteur = programmeCredits.getElementsByTagName("director")[0].textContent;
            programmeActeurs = programmeCredits.getElementsByTagName("actor");
            resPr['programmeDirecteur']=programmeDirecteur
            for(var x = 0; x < programmeActeurs.length; x++){
                acteurs += programmeActeurs[x].textContent + ", ";

            }
            rresPres['acteurs'] = acteurs

        }
        catch(exceptiondesc){
            //Si cette balise est absente, on informe l'utilisateur
            }
        }
    else if(programmeType == 'Magazine' || programmeType == 'Jeu' ||
        programmeType == 'Journal' || programmeType == 'Divertissement'){
        try{
            programmeDirecteur = programmeCredits.getElementsByTagName("presenter")[0].textContent;
            resPr['programmeDirecteur']=programmeDirecteur

        }
        catch(exceptiondesc){
            //Si cette balise est absente, on informe l'utilisateur
        }
    }

    try{
        programmeDate = pr.getElementsByTagName("date")[0].textContent;
        resPr['programmeDate']=programmeDate

    }
    catch(exceptiondesc){
    //Si cette balise est absente, on informe l'utilisateur
    }
    programmeLength = pr.getElementsByTagName("length");
    lenghtUnit = programmeLength[0].getAttribute("units");
    resPr['programmeLength']=programmeLength
    resPr['lenghtUnit']=lenghtUnit
    return resPr
}
function xml2json(xml){
    d=demain()
    resXml = {"programmes":[],"channels":[]}
    programmes=xml.getElementsByTagName("programme")
    for(j = 0; j < programmes.length; j++){
        if(parseInt(programmes[j].getAttribute("channel")) <20 && programmes[j].getAttribute("start") <d)
                resXml["programmes"].push(pr_json(programmes[j]))
    }
    channels=xml.getElementsByTagName("channel")
    for(j = 0; j < channels.length; j++){
        if(parseInt(channels[j].getAttribute("id")) <"20" )
                resXml["channels"].push(ch_json(channels[j]))
    } 
    return resXml;   
}

 function updateProgress (oEvent) {

    var percentComplete = Math.round(100 * oEvent.loaded / 8800408);
    console.log(percentComplete)
    $('#progess').text(percentComplete)
}

function transferComplete(evt) {
  console.log("Telechargement terminé.");
  $('#splashScreen').hide();
}

function process_xml(xmlData){

        var channels = xmlData.getElementsByTagName("channel");//balise chaine - liste de toutes les chaines
        
        var divg;
        
        
        for(i = 0; i < channels.length; i++){
                
                //On récupère l'ID et le nom de la chaine
                var channelId = channels[i].getAttribute("id");
                var channelName = channels[i].getElementsByTagName("display-name")[0].textContent;
                
                //On récupère le template
                var templateStruc = document.getElementById('structure');
                
                //On récupère la div swipe-wrap pour insérer notre template à jour plus tard
                var divParent = document.getElementsByClassName('swipe-wrap');
                
                //On clone le contenu du template pour insérer nos données
                var templateClone = templateStruc.content.cloneNode(true);
                
                
                //On insère le nom de la chaîne dans notre template
                templateClone.getElementById('channelName').textContent = channelName;
                
                //On récupère la liste d'accès rapide
                
                //ul
                var listeAccesRapide = document.getElementById('accesRapide');
                //li
                var itemListeAccesRapide = document.createElement('li');
                //h1
                var linkItemListeAccesRapide = document.createElement('h1');
                linkItemListeAccesRapide.setAttribute("id", "h"+i);
                $(linkItemListeAccesRapide).addClass("menu");
                linkItemListeAccesRapide.textContent = channelName;
                
                
                                
                
                
                itemListeAccesRapide.appendChild(linkItemListeAccesRapide);
                listeAccesRapide.appendChild(itemListeAccesRapide);
                
                var token = 0;
                var tokenS = 0;
                
                //On récupère le contenu des balises programme
                var programmes = xmlData.getElementsByTagName("programme");
                
                outer: for(j = 0; j < programmes.length; j++){
                    
                    //On stocke le numéro de la chaîne courante
                    var programmeId = programmes[j].getAttribute("channel");
                    
                    // On sauvegarde la date et l'heure de fin du programme courant
                    var programmeStop = programmes[j].getAttribute("stop");
                    var datestop = new Date(parseInt(programmeStop.substring(0,4)), (parseInt(programmeStop.substring(4,6))) - 1,
                            parseInt(programmeStop.substring(6,8)), parseInt(programmeStop.substring(8,10)), 
                          (programmeStop.substring(10,12)), 0);
                    
                    // Pour la comparaison, on convertit cette date en millisecondes
                    datestop = datestop.getTime();
                    
                    // Date du jour en millisecondes
                    var dateJour = new Date().getTime();
                    
                    
                    /*On regarde si le numéro de la chaîne courante match avec le numéro contenu dans l'attribut channel
                     * de la balise programme.
                     * De plus, on regarde si la date courante est plus petite que la date de fin du programme
                     * courant --> Si oui, on sait que ce programme passe actuellement donc on l'affiche.
                     */
                    if((programmeId == channelId) && (new Number(dateJour) < new Number(datestop)) && token == 0){
                        var programmeStart = programmes[j].getAttribute("start");
                           var debut = "Le " + programmeStart.substring(6,8) + "/" + 
                           programmeStart.substring(4,6) + "/" + 
                           programmeStart.substring(0,4) + " a " + 
                           programmeStart.substring(8,10) + "h" + 
                           programmeStart.substring(10,12);
                           
                       var programmeTitre = programmes[j].getElementsByTagName("title")[0].textContent;
                       
                       //On teste la présence du sous titre                        
                       var programmeSousTitre = null;
                       try{
                           programmeSousTitre = "("+programmes[j].getElementsByTagName("sub-title")[0].textContent+")";
                       }
                       catch(exceptiondesc){
                           //Si la balise sous titre est absente, on met null pour ne pas bloquer l'exécution du code
                           programmeSousTitre = null;
                       }

                       
                       var programmeDesc, programmeDirecteur, programmeCredits, programmeActeurs, acteurs, programmeDate, programmeType = null;
                       
                        //On teste la présence d'une description
                        try{
                            programmeDesc = programmes[j].getElementsByTagName("desc")[0].textContent;
                        }
                        catch(exceptiondesc){
                            //Si la balise description est absente, on informe l'utilisateur
                            programmeDesc = "Pas de description";
                        }
                        
                      //informations complémetaires
                        programmeType = programmes[j].getElementsByTagName("category")[0].textContent;
                        programmeCredits = programmes[j].getElementsByTagName("credits")[0];
                        
                        if(programmeType ==  'Documentaire' || programmeType == 'Feuilleton' ||
                                programmeType == 'Film' || programmeType == 'Téléfilm' ||
                                programmeType == 'Série'){
                            
                            try{
                                programmeDirecteur = programmeCredits.getElementsByTagName("director")[0].textContent;
                                programmeActeurs = programmeCredits.getElementsByTagName("actor");
                                
                                for(var x = 0; x < programmeActeurs.length; x++){
                                    acteurs += programmeActeurs[x].textContent + ", ";

                                }

                            }
                            catch(exceptiondesc){
                                //Si cette balise est absente, on informe l'utilisateur
                            }
                        }
                        
                        
                        else if(programmeType == 'Magazine' || programmeType == 'Jeu' ||
                                programmeType == 'Journal' || programmeType == 'Divertissement'){
                            try{
                                programmeDirecteur = programmeCredits.getElementsByTagName("presenter")[0].textContent;

                            }
                            catch(exceptiondesc){
                                //Si cette balise est absente, on informe l'utilisateur
                            }
                        }
                        
                        try{
                            programmeDate = programmes[j].getElementsByTagName("date")[0].textContent;

                        }
                        catch(exceptiondesc){
                            //Si cette balise est absente, on informe l'utilisateur
                        }
                        
                        
                        
                        
                        var programmeLength = programmes[j].getElementsByTagName("length");
                        var lenghtUnit = programmeLength[0].getAttribute("units");
                        
                      //On se positionne sur la balise des prochains programmes dans le template
                        var nextProg = templateClone.getElementById('programList').firstElementChild;
                        var baliseCourante = null;
                        
                        var programmeStartNext, lenghtUnitNext, debutNext, programmeLengthNext;
                        
                        /* Ici, affichage des prochains programmes de la chaîne courante
                         * La variable q permet de limiter l'affichage auxx 3 prochains programmes correspondant
                         * à la chaîne.
                         * On intialise une variable j au programme suivant et qui correspondant toujours à la
                         * chaîne courante.
                         */
                        for(q = 0, p = j + 1; q < 3 && programmeId == programmes[p].getAttribute("channel"); q++, p++){
                            
                            //On se positionne sur la 1ère balise des next programmes
                            baliseCourante = nextProg.firstElementChild;
                            
                            //On attache le titre de l'émission suivante
                            baliseCourante.textContent = programmes[p].getElementsByTagName("title")[0].textContent;
                            
                            //Passage au voisin suivant;
                            baliseCourante = baliseCourante.nextElementSibling;
                            
                            //On essaye de charger le sous titre.
                            try{
                                baliseCourante.textContent = programmes[p].getElementsByTagName("sub-title")[0].textContent;
                            }
                            catch(exceptiondesc){
                                //Si la balise sous titre est absente, on met null pour ne pas bloquer l'exécution du code
                                baliseCourante.textContent = null;
                            }
                            
                            //Voisin suivant
                            baliseCourante = baliseCourante.nextElementSibling;
                            
                            //Formattage de la variable start pour le début de programme
                            programmeStartNext = programmes[p].getAttribute("start");
                            debutNext = "Le " + programmeStartNext.substring(6,8) + "/" + 
                            programmeStartNext.substring(4,6) + "/" + 
                            programmeStartNext.substring(0,4) + " a " + 
                            programmeStartNext.substring(8,10) + "h" + 
                            programmeStartNext.substring(10,12);
                            
                            programmeLengthNext = programmes[p].getElementsByTagName("length");
                            lenghtUnitNext = programmeLengthNext[0].getAttribute("units");
                            
                            //On écrit dans cette balise les informations sur l'heure de début du programme
                            baliseCourante.textContent = debutNext + " (" + programmeLengthNext[0].textContent + " " + lenghtUnitNext +")";
                            
                            //On passe à la balise "programJ" suivant
                            nextProg = nextProg.nextElementSibling;
                        }
                        /* Cette chaîne contient déjà la liste des prochains programmes
                         * Ceci permettra de sortir de la boucle pour passer à la chaîne suivante
                         */
                        token = 1;
                     }
                    
                    
                    /*-------------------------PROGRAMMES DU SOIR----------------------*/
                    
                    var dateJourS = new Date();

                    var dateSoir = new Date(dateJourS.getFullYear(), dateJourS.getMonth(), dateJourS.getDate(), 20, 50,0);
                    
                    var programmeDeb = programmes[j].getAttribute("start");
                    var datestart = new Date(parseInt(programmeDeb.substring(0,4)), (parseInt(programmeDeb.substring(4,6))) - 1,
                            parseInt(programmeDeb.substring(6,8)), parseInt(programmeDeb.substring(8,10)), 
                          (programmeDeb.substring(10,12)), 0);
                    
                 // Pour la comparaison, on convertit cette date en millisecondes
                    datestart = datestart.getTime();
                    
                    dateSoir = dateSoir.getTime();
                                        
                    if((programmeId == channelId) && (new Number(dateSoir) <= new Number(datestart)) && tokenS == 0){
                        var programmeStartS = programmes[j].getAttribute("start");
                           var debutS = "Le " + programmeStartS.substring(6,8) + "/" + 
                           programmeStartS.substring(4,6) + "/" + 
                           programmeStartS.substring(0,4) + " a " + 
                           programmeStartS.substring(8,10) + "h" + 
                           programmeStartS.substring(10,12);
                           
                       var programmeTitreS = programmes[j].getElementsByTagName("title")[0].textContent;
                       
                       //On teste la présence du sous titre                        
                       var programmeSousTitreS = null;
                       try{
                           programmeSousTitreS = "("+programmes[j].getElementsByTagName("sub-title")[0].textContent+")";
                       }
                       catch(exceptiondesc){
                           //Si la balise sous titre est absente, on met null pour ne pas bloquer l'exécution du code
                           programmeSousTitreS = null;
                       }

                       
                       var programmeDescS, programmeDirecteurS, programmeCreditsS, programmeActeursS, acteursS, programmeDateS, programmeTypeS = null;
                       
                        //On teste la présence d'une description
                        try{
                            programmeDescS = programmes[j].getElementsByTagName("desc")[0].textContent;
                        }
                        catch(exceptiondesc){
                            //Si la balise description est absente, on informe l'utilisateur
                            programmeDescS = "Pas de description";
                        }
                        
                      //informations complémetaires
                        programmeTypeS = programmes[j].getElementsByTagName("category")[0].textContent;
                        programmeCreditsS = programmes[j].getElementsByTagName("credits")[0];
                        
                        if(programmeTypeS ==  'Documentaire' || programmeTypeS == 'Feuilleton' ||
                                programmeTypeS == 'Film' || programmeTypeS == 'Téléfilm' ||
                                programmeTypeS == 'Série'){
                            
                            try{
                                programmeDirecteurS = programmeCreditsS.getElementsByTagName("director")[0].textContent;
                                programmeActeursS = programmeCreditsS.getElementsByTagName("actor");
                                
                                for(var x = 0; x < programmeActeursS.length; x++){
                                    acteursS += programmeActeursS[x].textContent + ", ";

                                }

                            }
                            catch(exceptiondesc){
                                //Si cette balise est absente, on informe l'utilisateur
                            }
                        }
                        
                        
                        else if(programmeTypeS == 'Magazine' || programmeTypeS == 'Jeu' ||
                                programmeTypeS == 'Journal' || programmeTypeS == 'Divertissement'){
                            try{
                                programmeDirecteurS = programmeCreditsS.getElementsByTagName("presenter")[0].textContent;

                            }
                            catch(exceptiondesc){
                                //Si cette balise est absente, on informe l'utilisateur
                            }
                        }
                        
                        try{
                            programmeDateS = programmes[j].getElementsByTagName("date")[0].textContent;

                        }
                        catch(exceptiondesc){
                            //Si cette balise est absente, on informe l'utilisateur
                        }
                        
                        
                        
                        
                        var programmeLengthS = programmes[j].getElementsByTagName("length");
                        var lenghtUnitS = programmeLengthS[0].getAttribute("units");
                        
                      //On se positionne sur la balise des prochains programmes dans le template
                        var nextProgS = templateClone.getElementById('programListTonight').firstElementChild;
                        var baliseCouranteS = null;
                        
                        var programmeStartNextS, lenghtUnitNextS, debutNextS, programmeLengthNextS;
                        
                        /* Ici, affichage des prochains programmes de la chaîne courante
                         * La variable q permet de limiter l'affichage auxx 3 prochains programmes correspondant
                         * à la chaîne.
                         * On intialise une variable j au programme suivant et qui correspondant toujours à la
                         * chaîne courante.
                         */
                        for(q = 0, p = j + 1; q < 3 && programmeId == programmes[p].getAttribute("channel"); q++, p++){
                            
                            //On se positionne sur la 1ère balise des next programmes
                            baliseCouranteS = nextProgS.firstElementChild;

                            //On attache le titre de l'émission suivante
                            baliseCouranteS.textContent = programmes[p].getElementsByTagName("title")[0].textContent;
                            
                            //Passage au voisin suivant;
                            baliseCouranteS = baliseCouranteS.nextElementSibling;
                            
                            //On essaye de charger le sous titre.
                            try{
                                baliseCouranteS.textContent = programmes[p].getElementsByTagName("sub-title")[0].textContent;
                            }
                            catch(exceptiondesc){
                                //Si la balise sous titre est absente, on met null pour ne pas bloquer l'exécution du code
                                baliseCouranteS.textContent = null;
                            }
                            
                            //Voisin suivant
                            baliseCouranteS = baliseCouranteS.nextElementSibling;
                            
                            //Formattage de la variable start pour le début de programme
                            programmeStartNextS = programmes[p].getAttribute("start");
                            debutNextS = "Le " + programmeStartNextS.substring(6,8) + "/" + 
                            programmeStartNextS.substring(4,6) + "/" + 
                            programmeStartNextS.substring(0,4) + " a " + 
                            programmeStartNextS.substring(8,10) + "h" + 
                            programmeStartNextS.substring(10,12);
                            
                            programmeLengthNextS = programmes[p].getElementsByTagName("length");
                            lenghtUnitNextS = programmeLengthNextS[0].getAttribute("units");
                            
                            //On écrit dans cette balise les informations sur l'heure de début du programme
                            baliseCouranteS.textContent = debutNextS + " (" + programmeLengthNextS[0].textContent + " " + lenghtUnitNext +")";
                            
                            //On passe à la balise "programJ" suivant
                            nextProgS = nextProgS.nextElementSibling;
                        }
                        /* Cette chaîne contient déjà la liste des prochains programmes
                         * Ceci permettra de sortir de la boucle pour passer à la chaîne suivante
                         */
                        tokenS = 1;
                     }
                    
                    /*---------------------------------------------------------------------------*/
                    
                    if(token == 1 && tokenS == 1){
                        break outer;
                    }
                    
                }
                
                /*On récupère dans une variable tmp la première position de la balise mainProgram 
                 * pour commencer à insérer nos données. 
                 * Ceci nous permettra d'insérer nos données dans la variable templateClone qui contient notre
                 * template cloné. */
                var tmp =  templateClone.getElementById('mainProgram').firstElementChild;
                
                /* Ici, on parcourt la balise mainProgram du template cloné pour insérer chaque données. */
                
                //Insertion du titre du programme
               tmp.textContent = programmeTitre;
               
               //On passe au voisin suivant
               tmp = tmp.nextElementSibling;
                
                //Insertion du sous-titre du programme
                tmp.textContent = programmeSousTitre;
                
                //Voisin suivant
                tmp = tmp.nextElementSibling;
                    
                //Insertion de la date, l'heure de début et la durée du programme
                tmp.textContent = debut + " (" + programmeLength[0].textContent + " " + lenghtUnit +")";
                
                //Insertion de la description du programme
                //templateClone.getElementById('mainProgram').lastElementChild.textContent = programmeDesc;
                
                var infoComplementaire = templateClone.getElementById('info_complementaire').firstElementChild;
                // affichage de la description du programme
                var description = infoComplementaire.nextElementSibling;
                description.textContent = programmeDesc;
                
                //affichage des participants
                var directeur = description.nextElementSibling.nextElementSibling.nextElementSibling;
                directeur.textContent = programmeDirecteur;
                
                //affichage des acteurs
                var actors = directeur.nextElementSibling.nextElementSibling;
                actors.textContent = acteurs;
                
                //affichage date de sortie du programme
                var dateSortie = actors.nextElementSibling.nextElementSibling;
                dateSortie.textContent = programmeDate;
                
                //affichage du type du programme
                var type = dateSortie.nextElementSibling.nextElementSibling;
                type.textContent = programmeType;
                
                /*-------------------------------------------------------------------------*/
                
                var tmpS =  templateClone.getElementById('tonightMainProgram').firstElementChild;
                
                /* Ici, on parcourt la balise mainProgram du template cloné pour insérer chaque données. */
                
                //Insertion du titre du programme
               tmpS.textContent = programmeTitreS;
               
               //On passe au voisin suivant
               tmpS = tmpS.nextElementSibling;
                
                //Insertion du sous-titre du programme
                tmpS.textContent = programmeSousTitreS;
                
                //Voisin suivant
                tmpS = tmpS.nextElementSibling;
                    
                //Insertion de la date, l'heure de début et la durée du programme
                tmpS.textContent = debutS + " (" + programmeLengthS[0].textContent + " " + lenghtUnitS +")";
                
                //Insertion de la description du programme
                //templateClone.getElementById('mainProgram').lastElementChild.textContent = programmeDesc;
                
                var infoComplementaireS = templateClone.getElementById('info_complementaire_tonight').firstElementChild;
                // affichage de la description du programme
                var descriptionS = infoComplementaireS.nextElementSibling;
                descriptionS.textContent = programmeDescS;
                
                //affichage des participants
                var directeurS = descriptionS.nextElementSibling.nextElementSibling.nextElementSibling;
                directeurS.textContent = programmeDirecteurS;
                
                //affichage des acteurs
                var actorsS = directeurS.nextElementSibling.nextElementSibling;
                actorsS.textContent = acteursS;
                
                //affichage date de sortie du programme
                var dateSortieS = actorsS.nextElementSibling.nextElementSibling;
                dateSortieS.textContent = programmeDateS;
                
                //affichage du type du programme
                var typeS = dateSortieS.nextElementSibling.nextElementSibling;
                typeS.textContent = programmeTypeS;
                
                /*------------------------------------------------------------------------------*/
               
                
                //On rattache notre template à jour à la divB en fonction du numéro de la chaîne.
                var itemp = 'b' + i;
                var divbb = document.getElementById(itemp);
                divbb.appendChild(templateClone);
                
                //Notre divB qui contient notre template fourni est rattaché à la div générale
                var divgg = document.getElementById(i);
                divgg.appendChild(divbb);
                
                //Rattachement de la divGeneral à divParent (la div swipe-wrap)
                divParent[0].appendChild(divgg);
            }
}

function init(){
      document.getElementById('listIcon').addEventListener("click", function(){document.getElementById('listeProgramme').style.display = "block"; document.getElementsByTagName('body')[0].style.overflowY = "hidden";}, false);
        document.getElementById('closeIcon').addEventListener("click", function(){document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = "";}, false);
  
        //Liste de sélection des chaînes
        //document.getElementById('listeProgramme').style.display = 'none';
        
        for(var i = 0; i <  document.getElementsByClassName("info_complementaire").length; i++){
             
             document.getElementsByClassName("info_complementaire")[i].addEventListener("click", function(){this.style.height = "auto";}, false);
             document.getElementsByClassName("info_complementaire")[i].addEventListener("dblclick", function(){this.style.height = "115px";}, false);
             
        }
        
        $(".menu").on("click",function(){
                menu = $(this);
                idx=$(".menu").index(menu);
                mySwipe.slide(idx, 300);
                $('#listeProgramme').hide();
                $('body').css("overflowY", "")
            });



        var tonightMainProgram = document.getElementsByClassName('tonightMainProgram');
        var tonightNextPrograms = document.getElementsByClassName('tonightNextPrograms');
        
        var mainProgram = document.getElementsByClassName('mainProgram');
        var nextPrograms = document.getElementsByClassName('nextPrograms');
        
        
        //listeners pour afficher les programmes du soir
            
            $(".tonight").on("click", function(){
                
                tonight = $(this);
                idx=$(".tonight").index(tonight);
                now =$($(".now")[idx]);
                tonight.css("textShadow", "0px 0px 10px white");
                now.css("textShadow","0px 0px 0px white");
                

                document.getElementsByClassName('tonightIconArrow')[idx].style.display = 'block';
                
                  $('.tonightMainProgram').hide();
                  $('.tonightNextPrograms').hide();
                  $('.mainProgram').hide();
                  $('.nextPrograms').hide();

                mainProgram[idx].style.display = 'none';
                nextPrograms[idx].style.display = 'none';
                tonightMainProgram[idx].style.display = 'block';
                tonightNextPrograms[idx].style.display = 'block';
                document.getElementsByClassName('iconArrow')[idx].style.display = 'none';
            }
            );
            
            //listeners pour afficher les programmes en cours
            
            $(".now").on("click", function(){

                
                now = $(this);
                idx=$(".now").index(now);
                tonight =$($(".tonight")[idx]);
                now.css("textShadow", "0px 0px 10px white");
                tonight.css("textShadow","0px 0px 0px white");
                
                tonightMainProgram[idx].style.display = 'none';
                tonightNextPrograms[idx].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[idx].style.display = 'block';
                  $('.tonightMainProgram').hide();
                  $('.tonightNextPrograms').hide();
                  $('.mainProgram').hide();
                  $('.nextPrograms').hide();

                mainProgram[idx].style.display = 'block';
                nextPrograms[idx].style.display = 'block';
                document.getElementsByClassName('iconArrow')[idx].style.display = 'none';
            }
            );
            
}