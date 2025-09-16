document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tab');
  const demoFrame = document.getElementById('demoFrame');
  const demoMap = {
    'setup': 'demos/setup/setup.html',
    'prompt': 'demos/prompt/prompt.html',
    'summarizer': 'demos/summarizer/summarizer.html',
    'writer': 'demos/writer/writer.html',
    'translator': 'demos/translator/translator.html',
    'rewriter': 'demos/rewriter/rewriter.html',
    'proofreader': 'demos/proofreader/proofreader.html',
    'language-detector': 'demos/language-detector/language-detector.html',
    'alt-texter': 'demos/alt-texter/alt-texter.html'
  };
  function activateTab(tab) {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const demo = tab.getAttribute('data-demo');
    demoFrame.src = demoMap[demo];
  }
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      activateTab(tab);
    });
  });
  // Activate first tab and load its demo on open
  activateTab(tabs[0]);
});
