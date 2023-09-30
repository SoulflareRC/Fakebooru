export const TAG_TYPES = Object.freeze({
    GENERAL: 'general',
    ARTIST: 'artist',
    COPYRIGHT: 'copyright',
    CHARACTER: 'character',
    UNCATEGORIZED: 'uncategorized',
    toColor: (type) => {
      switch (type) {
        case 'uncategorized':
          return 'secondary';
        case 'general':
          return 'info';
        case 'artist':
          return 'warning';
        case 'copyright':
          return 'success';
        case 'character':
          return 'primary';
        default:
          return 'black';
      }
    },
  });
  export const POST_RATINGS = Object.freeze({
    GENERAL: 'general',
    SENSITIVE: 'sensitive',
    QUESTIONABLE: 'questionable',
    EXPLICIT: 'explicit',
    UNRATED: 'unrated',
    toColor: (rating) => {
      switch (rating) {
        case 'unrated':
          return 'secondary';
        case 'general':
          return 'success';
        case 'sensitive':
          return 'warning';
        case 'questionable':
          return 'primary';
        case 'explicit':
          return 'danger';
        default:
          return 'black';
      }
    },
  });
  