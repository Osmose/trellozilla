(function() {

var List = Model('list', function() {
    this.persistence(Model.localStorage);
});

var Trellozilla = {
    lists: [],
    content: $('#content'),
    addList: function(title, cards) {
        var list = this.createList(title, cards);
        this.showList(list.id());
    },
    createList: function(title, cards) {
        if (cards === undefined) cards = [];

        var list = new List({
            title: title,
            cards: cards
        });
        list.save();
        return list;
    },
    showList: function(id) {
        var list = List.find(id);
        if (list !== undefined) {
            this.lists.push(id);
            this.content.append(ich.list({
                title: list.attr('title')
            }));
        }
    },
    save: function() {
        var data = JSON.stringify({
            lists: this.lists
        });

        window.localStorage.setItem('trellozilla',  data);
    },
    load: function() {
        var data = window.localStorage.getItem('trellozilla');
        if (data !== undefined) {
            data = JSON.parse(data);
            this.lists = data.lists;
        }
    }
};

var lists = [
    {
        title: 'Sample List',
        type: 'basic',
        cards: [
            {text: 'Sample card'},
            {text: 'Another sample card'}
        ]
    },
    {
        title: 'Second List',
        type: 'basic',
        cards: [
            {text: 'This card is also a test'}
        ]
    },
    {
        title: 'Empty List',
        type: 'basic',
        cards: []
    },
    {
        title: 'Bugzilla Search',
        type: 'bz',
        search: {
            product: 'MyOwnBadSelf',
            component: 'comp2'
        },
        cards: []
    }
];

var content = $('#content'),
    bz = Bugzilla,
    tz = Trellozilla;

// Loads test data
crossroads.addRoute('test', function() {
    for (var k = 0; k < lists.length; k++) {
        var list = lists[k];
        if (list.type === 'bz') {
            bz.search(list.search).done(function(data) {
                var bugs = data.bugs;
                for (var m = 0; m < bugs.length; m++) {
                    list.cards.push({
                        text: bugs[m].summary
                    });
                }

                content.append(ich.list(list));
            });
        } else {
            content.append(ich.list(list));
        }
    }
});

// Add a normal list
crossroads.addRoute('list/new/normal', function() {
    var title = prompt("Title:");
    tz.addList(title);
});

$(function() {
    // Hasher handles history
    hasher.initialized.add(crossroads.parse, crossroads); //parse initial hash
    hasher.changed.add(crossroads.parse, crossroads); //parse hash changes
    hasher.init(); //start listening for history change

    // Init app with recent route
    var curHash = hasher.getHash();
    if (curHash == '') {
        hasher.setHash('test');
    }

    // Make cards sortable
    $('.card_list').livequery(function() {
        $(this).sortable({
            connectWith: '.card_list'
        });
    });
});

})();
