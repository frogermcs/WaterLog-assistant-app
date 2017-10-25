class Utils {
    static getTodayStartTimestamp() {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    }
}

module.exports = Utils;