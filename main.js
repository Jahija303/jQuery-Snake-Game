$(document).ready(function(){

    //Klasa koja sprema HighScore
    class HighScore {
        name = "Lala";
        points = 5;
    }

    //Manipulisanje canvasom, funkcijama canvasa se pristupa preko varijable c
    var canvas = document.getElementById('canvas');
    var c = canvas.getContext('2d');

    //Funkcija koja crta kvadrat, prima parametre lokacije (x,y) i boju
    function drawRect (x, y, color) {
        var size = 20;    //Default vrijednost
        var padding = 1;  //Default vrijednost
        c.fillStyle = color;
        c.fillRect( (size+padding)*x, (size+padding)*y, size, size);
    }

    //Varijable koje spremaju score i velicinu polja igranja
    var score = 0;
    var tableSize = 30;

    //Klasa koja sadrzi atribute i funkcije igraca
    class Player {

        x = 0;
        y = 0;
        color = "#f2f2f2";
        //Default vrijednost kretanja - desno
        smjer = 2;
        //Niz u koji se spremaju koordinate kvadrata repa
        tail = [];  

        //Funckija koja se pokrece prilikom svakog intervala
        updatePlayer() {

            //Petlja koja azurira pozicije kvadrata repa prilikom svakog intervala
            //U varijablu prev se spremaju trenutne koordinate
            var prev = { x:this.x, y:this.y };
            //Funckija prolazi kroz sve kvadrate repa, u svakoj iteraciji spremi trenutnu lokaciju repa u varijablu temp
            //zatim pomjeri kvadrat repa na trenutnu lokaciju, nakon toga nova trenutna lokacija postaje prethodna lokacija kvadrata repa
            //na taj nacin svaki sljedeci kvadrat repa bude pomjeren na lokaciju njegovog prethodnika
            for (var i = 0; i < this.tail.length; i++) {
                var temp = this.tail[i];
                this.tail[i] = prev;
                prev = temp;
            }

            //Uslov koji provjerava i azurira promjene smjera kretanja
            switch(this.smjer) {
                case 0: this.x -= 1; break;
                case 1: this.y -= 1; break;
                case 2: this.x += 1; break;
                case 3: this.y += 1; break;
            }

            //Ako igrac dodje do kraja polja, prebaci ga na suprotnu stranu pomocu funkcije loop
            this.x = this.loop( this.x );
            this.y = this.loop( this.y );
        }

        //Funckija koja dodaje novi kvadrat repa
        addTail() {
            this.tail.push( { x:this.x, y:this.y } );
            score++;
            //Azuriranje podatka score prilikom svakog dodavanja repa
            $("#score").html("Score: " + score);
        }

        //Funkcija koja provjerava da li je igrac dosao do kraja polja,
        // ako jest vraca azuriranu vrijednost(npr. ako je dosao do desne granice, prebacuje ga lijevo).
        // Koristi se u funkciji updatePlayer()
        loop( pozicija ) {
            if( pozicija < 0 ) {
                pozicija = tableSize - 1;
            } else if( pozicija > tableSize - 1 ) {
                pozicija = 0;
            }

            return pozicija;
        }
    }

    //Klasa koja sadrzi atribute i funkcije hrane
    class Food {
        x = 0;
        y = 0;
        color = "#0066ff";

        //Funckija koja dodjeljuje random poziciju hrani
        randomPos() {
            //Dodjela nasumicne vrijednosti koordinatama hrane x i y
            this.x = Math.floor((Math.random() * 29) + 1);
            this.y = Math.floor((Math.random() * 29) + 1);

            //Petlja koja provjerava da li je dodjeljena pozicija hrane jednaka poziciji zmije(nalazi se u njoj),
            // ako jest, funkcija se ponovo poziva i dodjeljuje se nova random pozicija.
            for(var i = 0; i < player.tail.length; i++) {
                if(this.x === player.tail[i].x && this.y === player.tail[i].y) {
                    this.randomPos();
                }
            }
        }
    }

    //Kreiranje instanci klasa i dodjela random pozicije hrani
    var player = new Player();
    var food = new Food();
    var highscore = new HighScore();
    food.randomPos();

    //Funckija koja provjerava da li je korisnik stisnuo tipku na tastaturi, ako je tipka jedna od strelica azurira se smjer kretanja igraca
    //Drugi if uslov provjerava da li korisnik pokusava da se krece u suprotnom smjeru, sto nije dozvoljeno
    window.onkeydown = function(event) {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            // Kod za strelicu gore je 38, kada se oduzme od tog broja 37, dobijemo vrijednost inputa 1,
            // sto se odnosi na switch case u prethodnoj funkciji
            var input = event.keyCode - 37;
            //Provjera instant kretanja u suprotnom smjeru
            if( (player.smjer === 0 && input === 2) || (player.smjer === 2 && input === 0) 
                || (player.smjer === 3 && input === 1) || (player.smjer === 1 && input === 3) ) {
                    //Smjer se ne mjenja
            } else {
                player.smjer = input;
            }
        }
    }

    //Funkcija koja mijenja velicinu teksta "click here to start"
    function AnimateClickHere() {
        //dodjeljuje se varijabli radi preglednijeg koda
        var div = $("#start-link");

        //Pomocu .animate povecava se velicina fonta sa 1500ms delay-om
        div.animate({fontSize: '25px'}, 1500);
        //Ponovo se poziva .animate kako bi se smanjila velicina fonta na njenu originalnu
        //U ovom slucaju kao callback je pozvana parent funkcija, koja ce se rekurzivno ponavljati svaki put kada druga .animate funkcija zavrsi
        div.animate({fontSize: '22px'}, 1500,AnimateClickHere);
    }

    //Fukcija ista kao prethodna, u ovom slucaju se radi o tekstu "GAME OVER"
    function AnimateGameOver() {
        var div = $("#gameover");

        div.animate({fontSize: '85px'}, 1500);
        div.animate({fontSize: '80px'}, 1500,AnimateGameOver);
    }

    //Pozivanje funkcije AnimateClickHere()
    AnimateClickHere()
    //Skrivanje odredjenih komponenti stranice prilikom prikazivanja pocetne stranice
    $("#canvas").hide();
    $("#restart").hide();
    $("#gameover").hide();
    $("#score").hide();
    $("#highscore").hide();
    $("#unos").hide();
    $("#continue").hide();

    //Nakon sto se stisne dugme start, ono se skriva, dok se prikazuju dvije nove komponente pomocu .fadeIn(delay 500ms)
    //Tekst sa pocetne stranice se pomjera prema gore pomocu .animate(delay 500ms)
    $("#start").click(function() {
        $(this).hide();
        $("#unos").fadeIn(500);
        $("#continue").fadeIn(500);

        $("#landing-page").animate({ marginTop: '250px' }, 500)
    })

    //Nakon sto se popuni forma i klikne dugme continue, dugme i forma se skrivaju dok se tekst pocetne stranice 
    // pomjera na vrh broswera pomocu .animate, i mijenja se njegova margina pomocu .css
    $("#continue").click(function() {
        $(this).hide();
        $("#unos").hide();

        $("#landing-page").animate({ marginTop: '20px' }, 500)
        $("#landing-page").css({ marginBottom: '20px' });

        //Takodjer se prikazuju tri nove komponente, score i highscore se prikazuje pomocu fadeIn, dok se canvas pomjera pomocu .css i prikazuje pomocu opacity opcije css-a
        $("#canvas").css({ marginTop: '20px' });
        $("#canvas").show();
        $("#canvas").animate({ marginTop: '0px', opacity: '1'}, 500);
        
        $("#score").fadeIn(500);
        $("#highscore").fadeIn(500);

        //Uslovi koji provjeravaju i azuriraju odabranu tezinu igre, vrijednost se dobavi pomocu .val
        var difficulty = $( "#diff" ).val();
        //Default vrijednost intervala - Easy
        var intervalValue = 180;
        
        //Npr. ako je $( "#diff" ).val() = 2, to znaci da je odabrana druga opcija (Medium), koristi se manji interval(zmija se krece brze)
        if (difficulty == "2") {
            intervalValue = 120;
        } else if (difficulty == "3") {
            intervalValue = 80;
        } else {
            console.log("Greska");
        }

        //Pocetno ispisivanje vrijednosti score-a i highscore-a
        $("#score").html("Score: " + score);
        $("#highscore").html("Highscore:    " + highscore.name + " " + highscore.points);

        //Funkcija koja se ponavlja po prethodno odredjenim intervalima
        var main = setInterval( function() {

            //Petlja koja crta polje igre(kvadrat po kvadrat)
            for (var x = 0; x < tableSize; x++) {
                for (var y = 0; y < tableSize; y++) {
                    //Pozivanje funkcije za crtanje kvadrata 30*30 puta, sa kustomiziranom bojom
                    drawRect(x,y,"#050505");
                }
            }
    
            //Pozivanje funkcije koja azurira poziciju igraca i repa, i smjer kretanja
            player.updatePlayer();
    
            //Uslov koji provjerava da li je igrac "pojeo" hranu
            //Ako jeste, dodaje se novi kvadrat na rep i dodjeljuje se nova random pozicija hrani
            if( player.x == food.x && player.y == food.y) {
                player.addTail();
                food.randomPos();

                //Uslov koji provjerava da li je igrac oborio rekord, ako jeste u odgovarajucu tabelu se upisuje njegovo ime i rezultat
                if(score > highscore.points) {
                    var player_name = document.getElementById("ime-input").value;
                    highscore.name = player_name;
                    highscore.points = score;
                    $("#highscore").html("Highscore:    " + highscore.name + " " + highscore.points);
                }
            }
            
            //Funkcije koje crtaju kvadrat glave igraca i hranu
            drawRect(player.x, player.y, player.color);
            drawRect(food.x, food.y, food.color);
    
            //Petlja koja crta kvadrate repa igraca
            for (var i = 0; i < player.tail.length; i++) {
                var p = player.tail[i];
                drawRect(p.x, p.y, player.color);
            }
    
            //Funkcija koja provjerava da je igrac napravio koliziju sa samim sobom
            for(var i = 1; i < player.tail.length; i++) {
                if(player.tail[0].x === player.tail[i].x && player.tail[0].y === player.tail[i].y) {
                    //Ako jeste, funkcija setInterval se zaustavlja
                    clearInterval(main);

                    //Dodavanje blura na element "blur"(citava stranica), pomocu .css i opcije filter css-a
                    $("#blur").css({ filter: 'blur(6px)' })
                    //Fade in teksta "game over" i dugmeta za restart
                    $("#gameover").fadeIn(500);
                    $("#restart").fadeIn(500);
                    //Poziva se prethodno kreirana funkcija za animaciju teksta "game over"
                    AnimateGameOver()
                    //Resetovanje repa igraca, pozicije i rezultata na 0
                    player.tail.length = 0;
                    player.x = 0;
                    player.y = 0;
                    score = 0;
                }
            }
            
        }, intervalValue);

        //Resetovanje margine elementa "#landing-page" na 0 pomocu .css
        $("#landing-page").css({"margin-top":"0px"});
    })

    //Nakon sto se klikne dugme za restart, prikazuju se odgovarajuce komponente na isti nacin kao sto to izgleda na pocetnoj stranici
    $("#restart").click(function() {
        //Skrivanje dugmeta restart
        $(this).hide();
        //Prikazivanje dugmeta za start
        $("#start").show();
        //Skrivanje svih ostalih komponenti
        $("#canvas").hide();
        $("#highscore").hide();
        $("#score").hide();
        $("#gameover").hide();

        //Vraca se margina elementa "#landing-page" na prethodnu vrijednost
        $("#landing-page").css({ marginTop: '320px' });
        //Uklanja se blur kreiran prilikom zavrsetka igre
        $("#blur").css({ filter: 'blur(0px)' })
    })
  });