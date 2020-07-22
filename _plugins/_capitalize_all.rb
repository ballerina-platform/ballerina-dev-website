require 'liquid'
require 'uri'

# Capitalize all words of the input
module Jekyll
  module CapitalizeAll
    def capitalize_all(words)
      return words.gsub("preview", "preview-").split('-').map(&:capitalize).join(' ')
    end
  end
end

Liquid::Template.register_filter(Jekyll::CapitalizeAll)
