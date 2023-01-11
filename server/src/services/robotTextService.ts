function getDefaultText(type: string): string {
  switch (type) {
    case 'Greeter':
      return 'Hello!';
    case 'Farewell':
      return 'Goodbye!';
    case 'Answer':
      return 'I can answer your question.';
    default:
      return '';
  }
} 

export default getDefaultText;
