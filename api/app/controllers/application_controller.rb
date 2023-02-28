class ApplicationController < ActionController::API
  before_action :set_locale

  private

  # Set the language
  def set_locale
    I18n.locale = if params[:locale].blank?
                    extract_locale_from_accept_language_header
                  else
                    params[:locale]
                  end
  end

  # Extract the language from the clients browser
  def extract_locale_from_accept_language_header
    browser_locale = request.env['HTTP_ACCEPT_LANGUAGE'].try(:scan, /^[a-z]{2}/).try(:first).try(:to_sym)
    if I18n.available_locales.include? browser_locale
      browser_locale
    else
      I18n.default_locale
    end
  end
end
