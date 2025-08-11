let selectedTags = [];

export class TagsService {
    static updateSelectedTags(tag) {
        if (selectedTags.includes(tag)) {
            selectedTags = selectedTags.filter(storedTag => storedTag !== tag);
        } else {
            selectedTags.push(tag);
        }
    }

    static getSelectedTags() {
        return selectedTags;
    }
}