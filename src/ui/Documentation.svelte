<script lang="ts">
    function scrollTo(hash: string) {
        location.hash = `#${hash}`;
    }
</script>

<main>
    <ul class="sections">
        <li on:click={(e) => scrollTo("introduction")}>Introduction</li>
        <li on:click={(e) => scrollTo("features")}>Features</li>
        <li on:click={(e) => scrollTo("home-page")}>The Home Page</li>
        <li on:click={(e) => scrollTo("lists")}>The Lists</li>
        <li on:click={(e) => scrollTo("traits-tab")}>Traits Tab</li>
        <li on:click={(e) => scrollTo("equipment-tab")}>Equipment Tab</li>

        <li on:click={(e) => scrollTo("configuration")}>Configuration</li>
    </ul>
    <div class="documentation">
        <section id="introduction">
            <h2>Introduction</h2>
            <div>
                Welcome to the
                <b>Valor Character Builder</b>. An online game aid for building
                GURPS characters. Here you will find information on on how to
                use the game aid, contributors to the project, and information
                on how to suggest or contribute features.
            </div>
        </section>

        <section id="features">
            <h2>Features</h2>
            <div>
                <ul>
                    <li>
                        Completely client side, there is no server where your
                        characters are stored. Data is persisted using the
                        IndexedDB API. (Dexie.js)
                    </li>
                    <li>
                        Record Skills, Traits, Spells, Equipment on character
                        sheets in nested lists.
                    </li>
                    <li>
                        Auto calculate skill levels, trait costs, equipment
                        weight, encumbrance, weapon attack levels, etc.
                    </li>
                    <li>
                        Support for custom attributes/pools/hit locations via a
                        config file. Store information on injury to hit
                        locations and pool levels.
                    </li>
                </ul>
            </div>
        </section>

        <section id="home-page">
            <h2>The Home Page</h2>
            <div>
                The home page is the first thing you see when visiting the
                website. It contains information about all the characters and is
                where you access the individual sheets that you have created.
            </div>
        </section>

        <section id="lists">
            <h2>The Lists</h2>
            <div>
                The lists in Valor have a lot of built in features. They are
                reordable (simply drag and drop) come with context menus, and
                some fields support inline editing. In general the following
                actions are available on most of the lists.
            </div>
            <ul>
                <li>Right click for context-menu</li>
                <li>Double click to bring up the main editor</li>
                <li>
                    Red cells are clickable, and will usually be used to
                    indicate rolls
                </li>
                <li>
                    Click the red
                    <span class="fas fa-plus text-red-700" />
                    symbol to add an entity to the list
                </li>
            </ul>
        </section>

        <section id="traits-tab">
            <h2>The Traits Tab</h2>
            <div>
                The traits tab contains information on all the traits you assign
                to your character. These are broken up into the following
                section for ease of categorization.
            </div>
            <ul>
                <li>Advantages</li>
                <li>Disadvantages</li>
                <li>Racial</li>
                <li>Meta</li>
                <li>Perks</li>
                <li>Quirks</li>
                <li>Features</li>
            </ul>
            <div>
                The list looks at the categories and then the point total cost
                of the trait to determine where it should go. Should traits with
                mixed types be put in the same container the sorting algorithm
                well attempt to resolve to the most applicable category.
            </div>
        </section>

        <section id="equipment-tab">
            <h2>The Equipment Tab</h2>
            <div>
                The equipment tab is used for keeping track of all the items a
                character has. It is a single list, however you can assign each
                item a location and display items from the list based on their
                location. Available locations are set from the config file
                <span>("equipment.locations")</span>
            </div>
        </section>

        <section id="configuration">
            <h2>Configuration</h2>
            <div>
                The Valor character sheet comes with the ability to configure a
                large portion of the underlying application and the UI of the
                sheet. Configuration files are written in json and can be edited
                directly from the settings tab of any character sheet.
            </div>
        </section>
    </div>
</main>

<style lang="postcss">
    .sections {
        @apply mx-2;
    }
    .sections li {
        @apply p-2 bg-gray-700 text-white border border-solid border-white;
    }
    main {
        @apply flex mt-3;
    }
    .documentation {
        @apply flex flex-col w-1/2;
    }
    .documentation ul,
    .documentation ol {
        @apply m-3;
    }
    .documentation ul {
        @apply list-inside list-disc;
    }
    .documentation ol {
        @apply list-inside list-decimal;
    }
    h2 {
        @apply text-xl font-bold underline p-2;
    }
</style>
