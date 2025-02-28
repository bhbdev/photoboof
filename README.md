# Photoboof 📸

__Have fun taking photos!__  

This little project was built with curiosity while exploring WebRTC, Angular and HTML Canvas.  

---

## Dev Notes

##### Install module deps
`npm install`

##### Run local app using angular-cli
`ng serve`




#### Using Docker
The Makefile provides targets to build and run a dockerized version of the app.


```sh 
make build # build local image
```
```sh 
make run   # run detached container
```
```sh 
make stop  # stop and remove container
```



**SSL notes*
> In order to use WebRTC API features on certain devices (iOS) you must use a secure HTTPS connection.

Check the readme in the `ssl` directory for more info.

---
...
life's short, have fun. 😁