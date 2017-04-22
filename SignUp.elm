module SignUp exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

type alias Model =
      {firstName : String
      , lastName : String
      , address : String
      , birthDay : String 
      , password : String
      }

initModel : Model
initModel = 
     { firstName = ""
     , lastName = ""
     , address = ""
     , birthDay = ""
     , password = ""
     }

--update

type Msg =
      FirstNameInput String
      | LastNameInput String
      | AddressInput String
      | BirthDayInput String
      | PasswordInput String


update : Msg -> Model -> Model
update msg model = 
     case msg of
          FirstNameInput firstName -> 
               { model | firstName = firstName}

          LastNameInput lastName ->
               { model | lastName = lastName}

          AddressInput address ->
               { model | address = address}

          BirthDayInput birthDay ->
               { model | birthDay = birthDay}

          PasswordInput password ->
               { model | password = password}

--view

view : Model -> Html Msg
view model =   
     div [style [("margin-top", "10%")]] 
         [ 
              div[style[("width", "70%"), ("margin", "auto")]][
                   h1 [style[("color", "#f22e2e"), ("text-align", "center") ] ] [ text "Create an account" ]
                 ]
              , Html.form [][
                   div [style [ ("text-align", "center"), ("margin", "auto"), ("width", "50%"), ("padding", "10px")] ]
                   [
                        input [type_ "text" 
                               , onInput FirstNameInput
                               , placeholder "First Name"
                               , style [ ("width", "100%"), ("border-radius", "5px"), ("height", "20px") ]][]
                        ,div [ style [ ("height", "15px") ] ] []
                        ,input [type_ "text"  
                               , onInput LastNameInput
                               , placeholder "Last Name"
                               , style [ ("width", "100%"), ("border-radius", "5px"), ("height", "20px") ]][]
                        ,div [ style [ ("height", "15px") ] ] []
                        ,input [type_ "text"  
                               , onInput AddressInput
                               , placeholder "Address"
                               , style [ ("width", "100%"), ("border-radius", "5px"), ("height", "20px") ]][]
                        ,div [ style [ ("height", "15px") ] ] []
                        ,input [type_ "text"  
                               , onInput BirthDayInput
                               , placeholder "Birthday"
                               , style [ ("width", "100%"), ("border-radius", "5px"), ("height", "20px") ]][]
                        ,div [ style [ ("height", "15px") ] ] []
                        ,input [type_ "password"  
                               , onInput PasswordInput
                               , placeholder "Password"
                               , style [ ("width", "100%"), ("border-radius", "5px"), ("height", "20px") ]][]
                        ,div [ style [ ("height", "15px") ] ] []
                        ,input [type_ "submit"
                               , style [ ("background-color", "#f22e2e"), ("border", "none"), ("color", "white"), ("text-align", "center"), ("text-decoration", "none"), ("display", "inline-block"), ("font-size", "15px"), ("padding", "10px 20px"), ("border-radius", "3px")]][text "Sign Up"]
              ]]
              ,hr [][]
         
    ]

main = Html.beginnerProgram{
         model = initModel
         , view = view
         , update = update
         }

