<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <title>Three.js Starter</title>
    <meta name="description" content="Three.js Starter pack.">

    <!-- TODO add og, canonical, robots -->
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <link rel="icon" href="favicon.ico" />
    <link rel="stylesheet" href="build/app.css">
</head>
<body>

<div id="hud">
    <div id="phone-opener" data-open="phone" class="locked" style="background-image: url('images/phone.png')">
        <div class="notification" ></div>
    </div>

    <div id="message"></div>

    <div id="hours"></div>
</div>


<div id="slide-content">
    <div></div>
</div>

<div id="cover">
    <img src="images/logo.png">
    <p>Seulement sur mobile</p>
    <button>Démarrer l'expérience</button>
</div>


<div id="loading">
    <h3>Construction du monde</h3>
    <div class="progress-bar">
        <div style="width: 0"></div>
    </div>
</div>

<div id="transition"></div>

<div id="pickup">
    <p class="pickup-content"></p>
    <img src="images/letters/test.png">
    <button data-close-pickup="">Fermer</button>
</div>

<div id="conclusion">
    <div class="conclude-block" data-conclusion="scene-1">
        <div class="conclude">
            <p>
                La femme n'a pas de place dans les médias traditionnels quand on parle des féminicides.
            </p>
            <button data-close-conclusion="scene-1">Close</button>
        </div>
    </div>
    <div class="conclude-block" data-conclusion="scene-2">
        <div class="conclude">
            <p>
                Pour dénoncer les féminicides, les femmes ont créé un nouveau média : les collages. Elles communiquent par Instagram pour rester dans l’anonymat.
            </p>
            <button data-close-conclusion="scene-2">Close</button>
        </div>
    </div>
    <div class="conclude-block" data-conclusion="scene-3">
        <div class="conclude">
            <p>
                La faible visibilité dans les médias contribue au manque de sensibilisation et d'information d'un grand nombre de la population sur les féminicides.
            </p>
            <button data-close-conclusion="scene-3">Close</button>
        </div>
    </div>
    <div class="conclude-block" data-conclusion="final">
        <div class="conclude">
            <p>On décrit comme féminicide, le meurtre de personne(s) de sexe féminin </p>
        </div>
        <div class="conclude">
            <p>Il y a souvent des signes qui indiquent la situation d'une victime. </p>
        </div>
        <div class="conclude">
            <p>Pour aider les victimes et sauver des vies, prenez des nouvelles ou si vous entendez des cris et coups chez votre voisine, appelez le 17. </p>
        </div>
        <div class="conclude">
            <p>Peu de féminicides sont abordés dans les médias et la population y est peu sensibilisée. </p>
        </div>
        <div class="conclude">
            <p>Depuis 2019, dans toute la France, les colleuses se mobilisent pour dénoncer les violences faites aux femmes grâce aux collages. Collage féminicide Instagram </p>
        </div>
        <div class="conclude">
            <p>Depuis 2020, 27 femmes ont été tué par leur conjoint. Mais la prise d'initiative continue et doit se renforcer. Vous aussi vous pouvez aider en étant vigilant et en sensibilisant votre entourage. </p>
        </div>
    </div>
</div>

<div id="phone">
    <div class="app app_title-only" id="app_maps">
        <div class="app-close"></div>
        <div class="app-name">
            <span>CARTE</span>
        </div>
    </div>
    <div class="app" id="app_notes">
        <div class="app-close"></div>
        <div class="app-name">
            <span>FICHIERS</span>
        </div>
        <script data-template="memo_el" type="text/html">
            <div class="app-list-item" data-record="{id}">
                <div class="app-toggler" data-to-toggle="{name}">
                    <p class="important">{name}</p>
                    <span class="small o-60">{date}</span>
                    <span class="small o-60 f-r">{duration_text}</span>
                </div>
                <div class="app-toggled" data-to-toggle="{name}">
                    <div class="timeline">
                        <div></div>
                        <input type="range" value="0" min="0" step="any" max="{duration}">
                    </div>
                    <button class="">Play</button>
                </div>
            </div>
        </script>
        <script data-template="photo_el" type="text/html">
            <div class="app-grid-item" data-letter="{id}">
                <img src="images/letters/test.png">
            </div>
        </script>
        <div class="app-content">
            <h2>Enregistrements vocaux</h2>
            <div class="app-list"></div>
            <h2>Documents</h2>
            <div class="app-grid"></div>
        </div>
    </div>
    <div class="app" id="app_phone">
        <div class="app-content app-content_full app-content_center">
            <div class="app-icon-group">
                <div class="app-icon" data-open="notes">
                    <img src="images/app/folder.svg">
                    <div class="notification"></div>
                </div>
                <div class="app-icon" data-open="maps">
                    <img src="images/app/map.svg">
                    <div class="notification"></div>
                </div>
                <div class="app-icon" data-open="instagram">
                    <img src="images/app/instagram.svg">
                    <div class="notification"></div>
                </div>

            </div>
            <div class="app-close app-close_bottom"></div>
        </div>
    </div>
    <div class="app" id="app_call">
        <div class="app-content app-content_full">
            <span>Le sang 💯💯</span>
            <span class="duration">00:00</span>
            <button>Décrocher</button>
        </div>
    </div>
    <div class="app" id="app_instagram">
        <div class="app-close"></div>
        <div class="app-name">
            <span>Instagram</span>
        </div>
        <script data-template="ig_el" type="text/html">
            <div class="app-list-item" data-record="{id}">
                <div    data-to-toggle="{name}">
                    <p class="important">{name}</p>
                    <div class="slider">
                        <div class="slide"><img src="images/slides/slide_1.png"></div><div class="slide"><img src="images/slides/slide_2.png"></div><div class="slide"><img src="images/slides/slide_3.png"></div>
                    </div>
                    <span class="small o-60 f-r">{commentary}</span>
                </div>
            </div>
        </script>
        <div class="app-content">
            <div class="app-list"></div>
        </div>
    </div>
</div>


<script src="build/runtime.js"></script>
<script src="build/app.js?v=<?= uniqid(); ?>"></script>
</body>
</html>
