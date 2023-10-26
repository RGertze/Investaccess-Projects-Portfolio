import axios from "axios";

export const handler = async (event) => {

    let response = {
        statusCode: 200,
        body: JSON.stringify('ok'),
    };

    let config = {
        validateStatus: (status) => status < 300
    }

    try {
        let result = await axios.post(
            "https://its.elearning-swakopca.edu.na/api/finances/statements/charge-monthly-fees",
            {
                token: "6ec6e84640767e7864fb370bbfc70204abe1852c078410c9e8059d8507d8e1b2"
            },
            config
        );

        response.body = JSON.stringify(result.data.data);
    } catch (error) {
        console.log(error);

        if (error.response) {
            response.statusCode = error.response.status ?? 500;

            if (error.response.data.errorMessage)
                response.body = JSON.stringify(error.response.data.errorMessage);
        } else {
            response.statusCode = 500;
            response.body = JSON.stringify('ok');
        }
    }

    return response;
};
