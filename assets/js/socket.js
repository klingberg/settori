// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/web/endpoint.ex":
import { Socket } from 'phoenix';

// const getCookie = cname => {
//     let name = cname + '=';
//     let decodedCookie = decodeURIComponent(document.cookie);
//     let ca = decodedCookie.split(';');
//     for (let i = 0; i < ca.length; i++) {
//         let c = ca[i];
//         while (c.charAt(0) === ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) === 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return '';
// };
if (
    !document.cookie.split(';').filter(item => item.includes('playerId='))
        .length
) {
    const playerId = Math.floor(Math.random() * 900000) + 100000;
    document.cookie = `playerId=${playerId}`;
}

// let socket = new Socket('/socket', { params: { token: window.userToken } });
const playerId = document.cookie.replace(
    /(?:(?:^|.*;\s*)playerId\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
);
let socket = new Socket('/socket', { params: { playerId: playerId } });

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

socket.connect();

// Now that you are connected, you can join channels with a topic:

let channel = socket.channel('room:lobby', {});

const keypress = event => {
    const charCode = event.charCode;
    switch (charCode) {
        case 97:
        case 104:
            channel.push('player:move', { direction: 'LEFT' });
            break;
        case 100:
        case 108:
            channel.push('player:move', { direction: 'RIGHT' });
            break;
        case 106:
        case 115:
            channel.push('player:move', { direction: 'DOWN' });
            break;
        case 107:
        case 119:
            channel.push('player:move', { direction: 'UP' });
            break;
        case 32:
            channel.push('player:shoot', {});
            break;
        default:
    }
};
window.addEventListener('keypress', keypress);

// window.addEventListener('keypress', event => {
//     const charCode = event.charCode;
//     switch (charCode) {
//         case 97:
//         case 104:
//             channel.push('player:move', { direction: 'LEFT' });
//             break;
//         case 100:
//         case 108:
//             channel.push('player:move', { direction: 'RIGHT' });
//             break;
//         case 106:
//         case 115:
//             channel.push('player:move', { direction: 'DOWN' });
//             break;
//         case 107:
//         case 119:
//             channel.push('player:move', { direction: 'UP' });
//             break;
//         case 32:
//             channel.push('player:shoot', {});
//             break;
//         default:
//     }
// });

channel.on('player:shoot', payload => {
    console.log('shoot');
});

channel.on('update:players', payload => {
    movePlayers(payload.players);
    // console.log(payload);
});

channel.on('player:position', payload => {
    const player = payload.player;
    const element = document.getElementById(`id-${player.id}`);
    element.style.transform = `matrix(1, 0, 0, 1, ${player.x}, ${player.y})`;
});

channel.on('player:joined', payload => {
    const player = payload.player;
    if (!document.getElementById(`id-${player.id}`)) {
        const element = document.createElement('div');
        element.setAttribute('class', 'player');
        element.setAttribute('id', `id-${player.id}`);
        element.style.transform = `matrix(1, 0, 0, 1, ${player.x}, ${
            player.y
        })`;
        // element.style.backgroundColor = `#${player.id}`;
        document.getElementById('sector').appendChild(element);
        // document.body.appendChild(element);
    }
});

const movePlayers = players => {
    Object.entries(players).forEach(([key, player]) => {
        const element = document.getElementById(`id-${player.id}`);
        const scale = 20;
        element.style.transform = `matrix(1, 0, 0, 1, ${player.x *
            scale}, ${player.y * scale})`;
    });
};

channel
    .join()
    .receive('ok', resp => {
        const players = resp.players;
        Object.entries(players).forEach(([key, player]) => {
            const element = document.createElement('div');
            element.setAttribute('class', 'player');
            element.setAttribute('id', `id-${player.id}`);
            element.style.transform = `matrix(1, 0, 0, 1, ${player.x}, ${
                player.y
            })`;
            // element.style.backgroundColor = `#${player.id}`;
            document.getElementById('sector').appendChild(element);
            // document.body.appendChild(element);
        });
    })
    .receive('error', resp => {
        console.log('Unable to join', resp);
    });

export default socket;
