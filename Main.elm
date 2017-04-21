module Login exposing (main)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)

-- model


type alias Model =
    { username : String
    , password : String
    }


initModel : Model
initModel =
    { username = ""
    , password = ""
    }



-- update


type Msg
    = UsernameInput String
    | PasswordInput String


update : Msg -> Model -> Model
update msg model =
    case msg of
        UsernameInput username ->
            { model | username = username }

        PasswordInput password ->
            { model | password = password }



-- view


view : Model -> Html Msg
view model =
    div [ style [ ("margin-top", "10%") ] ]
        [ div [ style [ ("width", "70%"), ("margin", "auto") ] ] 
              [ h1 [Html.Attributes.style[ ("color", "#4caf50"), ("text-align", "center") ] ] [ text "L  o  g  i  n" ] ] 
        , Html.form []
            [ div [style [ ("text-align", "center"), ("margin", "auto"), ("width", "50%"), ("padding", "10px")] ] [input
                [ type_ "text"
                , onInput UsernameInput
                , placeholder "Username"
                , style [ ("width", "100%"), ("border-radius", "5px"), ("height", "20px") ] ]
                []
            , div [style [ ("height", "10px") ] ] []
            , input
                [ type_ "password"
                , onInput PasswordInput
                , placeholder "Password"
                , style [ ("width", "100%"), ("border-radius", "5px"), ("height", "20px")  ]]
                [] 
            , div [ style [ ("height", "15px") ] ] []
            , input [ type_ "submit", style [ ("background-color", "#4CAF50"), ("border", "none"), ("color", "white"), ("text-align", "center"), ("text-decoration", "none"), ("display", "inline-block"), ("font-size", "15px"), ("padding", "10px 20px"), ("border-radius", "3px") ] ]
                [ text "Login" ] ]
            ]
        , hr [] []
        ]

main =
    Html.beginnerProgram
        { model = initModel
        , view = view
        , update = update
        }
