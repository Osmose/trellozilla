(function() {

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

var content = $('#content');

var bz, Bugzilla = bz = {
    API: 'https://api-dev.bugzilla.mozilla.org/test/latest/',
    search: function(params) {
        return this._ajax('bug', 'GET', params);
    },
    _ajax: function(path, type, data) {
        return $.ajax({
            url: this.API + path,
            type: type,
            data: data,
            dataType: 'json'
        });
    }
};

$(function() {
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

    $('.card_list').livequery(function() {
        $(this).sortable({
            connectWith: '.list'
        });
    });
});

})();
