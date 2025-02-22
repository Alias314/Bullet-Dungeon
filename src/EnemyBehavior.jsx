
export function follow(playerPos, enemyPos, speed) {
    const velocity = {
        x: 0,
        y: 0,
        z: 0,
    };

    if (playerPos.x < enemyPos.x) velocity.x = -speed;
    if (playerPos.x > enemyPos.x) velocity.x = speed;
    if (playerPos.z < enemyPos.z) velocity.z = -speed;
    if (playerPos.z > enemyPos.z) velocity.z = speed;

    return velocity;
}

export function wander(positionToWander, enemyPos, speed) {
    const velocity = {
        x: 0,
        y: 0,
        z: 0,
    };

    if (positionToWander.x < enemyPos.x) velocity.x = -speed;
    if (positionToWander.x > enemyPos.x) velocity.x = speed;
    if (positionToWander.z < enemyPos.z) velocity.z = -speed;
    if (positionToWander.z > enemyPos.z) velocity.z = speed;

    return velocity;
}

export function runAway(playerPos, enemyPos, speed) {
    const velocity = {
        x: 0,
        y: 0,
        z: 0,
    };

    if (playerPos.x < enemyPos.x) velocity.x = speed;
    if (playerPos.x > enemyPos.x) velocity.x = -speed;
    if (playerPos.z < enemyPos.z) velocity.z = speed;
    if (playerPos.z > enemyPos.z) velocity.z = -speed;

    return velocity;
}

export function stalk(playerPos, enemyPos, speed, absoluteDistance, distanceToStalk) {
    const velocity = {
        x: 0,
        y: 0,
        z: 0,
    };

    if (playerPos.x < enemyPos.x) velocity.x = -speed;
    if (playerPos.x > enemyPos.x) velocity.x = speed;
    if (playerPos.z < enemyPos.z) velocity.z = -speed;
    if (playerPos.z > enemyPos.z) velocity.z = speed;

    if (absoluteDistance[0] < distanceToStalk && absoluteDistance[2] < distanceToStalk) {
        if (playerPos.x < enemyPos.x) velocity.x = speed;
        if (playerPos.x > enemyPos.x) velocity.x = -speed;
        if (playerPos.z < enemyPos.z) velocity.z = speed;
        if (playerPos.z > enemyPos.z) velocity.z = -speed;
    }

    return velocity;
}