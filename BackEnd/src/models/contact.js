class Contact{
    constructor(id, name,location,phone,inCount,outCount,date) {
        this.id = id;
    this.name = name;
    this.location = location;
    this.phone = phone;
    this.inCount = inCount;
    this.outCount = outCount;
    this.date = date;

};
setId(id)
{
    this.id=id;
}
}

module.exports = Contact

