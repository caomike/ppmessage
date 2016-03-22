# `pip install markdown`
# documentation: https://pythonhosted.org/Markdown/reference.html
# markdown should follows the syntax rules : http://daringfireball.net/projects/markdown/syntax#precode
import markdown 

import codecs
import json
from HTMLParser import HTMLParser

class Markdown2Doc:

    def __init__(self, doc_path):
        self.doc_path = doc_path
        self.doc_text = ''
        self.markdown_html = ''
        
        self._read_doc()
        self._markdown_to_html()

    def _read_doc(self):
        input_file = codecs.open(self.doc_path, mode="r", encoding="utf-8")
        self.doc_text = input_file.read()
        input_file.close()

    def _markdown_to_html(self):
        self.markdown_html = markdown.markdown(self.doc_text)

    def render(self):
        return self.markdown_html

if __name__ == '__main__':
    markdown2Doc = Markdown2Doc('/Users/zhaokun/mdm/mdm/pphome/utils/test.md')
    print markdown2Doc.render()
