exports.index = (req, res) => {
    //res.send('send all stories');
    res.render('./');
};

exports.about = (req, res) => {
    res.render('./about.ejs');
};

exports.contact = (req, res) => {
    res.render('./contact.ejs');
};